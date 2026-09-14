<?php
/**
 * JIMON GROUP Uzbekistan — lead endpoint for shared hosting (Apache + PHP 7.4+).
 * Receives JSON from the site forms, validates it, and delivers to Telegram and/or e-mail.
 * Configure in lead.config.php (see lead.config.example.php).
 */
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

$config = file_exists(__DIR__ . '/lead.config.php') ? include __DIR__ . '/lead.config.php' : [];
$config += ['telegram_bot_token' => '', 'telegram_chat_id' => '', 'email_to' => '', 'log_file' => __DIR__ . '/leads.log'];

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'method_not_allowed']);
    exit;
}

// Same-origin guard: accept only requests from this site.
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$host = $_SERVER['HTTP_HOST'] ?? '';
$normalizeHost = function ($h) { return strtolower(preg_replace('/^www\./', '', preg_replace('/:\d+$/', '', (string) $h))); };
if ($origin !== '' && $normalizeHost(parse_url($origin, PHP_URL_HOST)) !== $normalizeHost($host)) {
    http_response_code(403);
    echo json_encode(['error' => 'forbidden']);
    exit;
}

// Simple per-IP rate limit: max 12 requests per 10 minutes.
$ip = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? 'anon';
$ip = trim(explode(',', $ip)[0]);
$rlFile = sys_get_temp_dir() . '/jimon_rl_' . md5($ip);
$rl = file_exists($rlFile) ? json_decode((string) file_get_contents($rlFile), true) : null;
$now = time();
if (!$rl || $now - $rl['t'] > 600) $rl = ['t' => $now, 'n' => 0];
$rl['n']++;
@file_put_contents($rlFile, json_encode($rl));
if ($rl['n'] > 12) {
    http_response_code(429);
    echo json_encode(['error' => 'rate_limited']);
    exit;
}

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);
if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['error' => 'bad_json']);
    exit;
}

// Honeypot: bots fill the hidden field — pretend success.
if (!empty($data['website'])) {
    echo json_encode(['ok' => true]);
    exit;
}

$clean = function ($v, $max) {
    $v = is_string($v) ? trim($v) : '';
    $v = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F]/u', '', $v);
    return mb_substr($v, 0, $max);
};

$type = ($data['type'] ?? '') === 'partner' ? 'partner' : (($data['type'] ?? '') === 'buyer' ? 'buyer' : '');
$name = $clean($data['name'] ?? '', 80);
$phone = $clean($data['phone'] ?? '', 24);
$lang = ($data['lang'] ?? 'ru') === 'uz' ? 'uz' : 'ru';
$page = $clean($data['page'] ?? '/', 200);

$errors = [];
if ($type === '') $errors[] = 'type';
if (mb_strlen($name) < 2) $errors[] = 'name';
if (!preg_match('/^[+\d][\d\s()\-]{6,}$/', $phone)) $errors[] = 'phone';

$lines = [];
if ($type === 'buyer') {
    $product = $clean($data['product'] ?? '', 160);
    $channel = ($data['channel'] ?? 'telegram') === 'whatsapp' ? 'whatsapp' : 'telegram';
    $lines[] = '🟢 Заявка на консультацию (JIMON UZ)';
    $lines[] = 'Имя: ' . $name;
    $lines[] = 'Телефон: ' . $phone;
    if ($product !== '') $lines[] = 'Интерес: ' . $product;
    $lines[] = 'Ответить в: ' . $channel;
} elseif ($type === 'partner') {
    $city = $clean($data['city'] ?? '', 80);
    $telegram = $clean($data['telegram'] ?? '', 80);
    $comment = $clean($data['comment'] ?? '', 600);
    if (mb_strlen($city) < 2) $errors[] = 'city';
    if (mb_strlen($telegram) < 2) $errors[] = 'telegram';
    $lines[] = '🤝 Заявка на партнёрство (JIMON UZ)';
    $lines[] = 'Имя: ' . $name;
    $lines[] = 'Телефон: ' . $phone;
    $lines[] = 'Город: ' . $city;
    $lines[] = 'Telegram: ' . $telegram;
    if ($comment !== '') $lines[] = 'Комментарий: ' . $comment;
}
if ($errors) {
    http_response_code(422);
    echo json_encode(['error' => 'invalid', 'fields' => $errors]);
    exit;
}
$lines[] = 'Язык: ' . $lang . ' · Страница: ' . $page;
$lines[] = 'Время: ' . date('Y-m-d H:i:s');
$text = implode("\n", $lines);

$delivered = 0;

// 1) Telegram bot
if ($config['telegram_bot_token'] && $config['telegram_chat_id']) {
    $url = 'https://api.telegram.org/bot' . $config['telegram_bot_token'] . '/sendMessage';
    $payload = http_build_query(['chat_id' => $config['telegram_chat_id'], 'text' => $text]);
    $ok = false;
    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [CURLOPT_POST => true, CURLOPT_POSTFIELDS => $payload, CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 10]);
        $res = curl_exec($ch);
        $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        $ok = $res !== false && $code === 200;
    } else {
        $ctx = stream_context_create(['http' => ['method' => 'POST', 'header' => "Content-Type: application/x-www-form-urlencoded\r\n", 'content' => $payload, 'timeout' => 10]]);
        $ok = @file_get_contents($url, false, $ctx) !== false;
    }
    if ($ok) $delivered++;
}

// 2) E-mail
if ($config['email_to']) {
    $subject = $type === 'partner' ? 'JIMON UZ: заявка на партнёрство' : 'JIMON UZ: заявка на консультацию';
    $headers = "Content-Type: text/plain; charset=utf-8\r\nFrom: no-reply@" . preg_replace('/^www\./', '', $host) . "\r\n";
    if (@mail($config['email_to'], '=?UTF-8?B?' . base64_encode($subject) . '?=', $text, $headers)) $delivered++;
}

// 3) Always keep a local log (protected by .htaccess)
@file_put_contents($config['log_file'], '[' . date('c') . '] ' . str_replace("\n", ' | ', $text) . PHP_EOL, FILE_APPEND | LOCK_EX);
if (!$config['telegram_bot_token'] && !$config['email_to']) $delivered++; // log-only mode still counts as accepted

if ($delivered === 0) {
    http_response_code(502);
    echo json_encode(['error' => 'delivery_failed']);
    exit;
}
echo json_encode(['ok' => true]);
