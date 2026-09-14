<?php
/**
 * Copy this file to lead.config.php (same folder) and fill in the values.
 * Never publish lead.config.php anywhere else — it contains the bot token.
 */
return [
    // Telegram bot (create via @BotFather). chat_id = your user id (message @userinfobot) or a group id.
    'telegram_bot_token' => '',
    'telegram_chat_id' => '',
    // Optional: also send each lead by e-mail.
    'email_to' => '',
    // Local log of all leads (kept next to the script, blocked from the web by .htaccess).
    'log_file' => __DIR__ . '/leads.log',
];
