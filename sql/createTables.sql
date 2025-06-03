/*アカウントテーブル*/
CREATE TABLE accounts(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    img_url VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
)ENGINE=InnoDB;


/*ランク定義*/
CREATE TABLE ranks(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    level INT NOT NULL UNIQUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
)ENGINE=InnoDB;

/*アカウントステータス*/
CREATE TABLE account_states(
    account_id INT NOT NULL PRIMARY KEY,
    rank_id INT NOT NULL,
    goods INT NOT NULL DEFAULT 0,
    reports INT NOT NULL DEFAULT 0,
    state INT NOT NULL DEFAULT 0,
    FOREIGN KEY (account_id) REFERENCES accounts(id),
    FOREIGN KEY (rank_id) REFERENCES ranks(id)
)ENGINE=InnoDB;


/*フレンド*/
CREATE TABLE friends(
    account_id INT NOT NULL,
    friend_id INT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES accounts(id),
    FOREIGN KEY (friend_id) REFERENCES accounts(id),
    PRIMARY KEY (account_id,friend_id)
)ENGINE=InnoDB;

/*フレンドチャット*/
CREATE TABLE friend_chats(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    friend_id INT NOT NULL,
    text TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (friend_id) REFERENCES accounts(id)
)ENGINE=InnoDB;

/*アカウントとランクの紐づけ*/
CREATE TABLE account_ranks(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    account_id INT NOT NULL,
    rank_id INT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES accounts(id),
    FOREIGN KEY (rank_id) REFERENCES ranks(id)
)ENGINE=InnoDB;

/*ディベートモード*/
CREATE TABLE debate_modes(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    decision_method INT NOT NULL,
    allows_abstain BOOLEAN NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    
)ENGINE=InnoDB;

/*ai設定テーブル*/
CREATE TABLE ai_configs(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
    config_name VARCHAR(100) NOT NULL,
    system_prompt TEXT NOT NULL,
    ai_model VARCHAR(100) NOT NULL
)ENGINE=InnoDB;
/*ディベートのトピック*/
CREATE TABLE debate_topics(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    topic VARCHAR(255) NOT NULL,
    enable BOOLEAN NOT NULL DEFAULT true,
    created_at DATETIME 
)ENGINE=InnoDB;



/*ディベートルーム*/
CREATE TABLE debate_rooms(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    debate_mode_id INT NOT NULL,
    ai_config_id INT NOT NULL,
    debete_topic_id INT NOT NULL,
    allow_observation BOOLEAN NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (debate_mode_id) REFERENCES debate_modes(id),
    FOREIGN KEY (ai_config_id) REFERENCES ai_configs(id),
    FOREIGN KEY (debete_topic_id) REFERENCES debate_topics(id)
)ENGINE=InnoDB;

/*1人あたりのディベート履歴*/
CREATE TABLE debate_histories(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    debate_room_id INT NOT NULL,
    account_id INT NOT NULL,
    role INT NOT NULL,
    win_flag INT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (debate_room_id) REFERENCES debate_modes(id),
    FOREIGN KEY (account_id) REFERENCES accounts(id),
    UNIQUE (debate_room_id, account_id)
)ENGINE=InnoDB;


/*ディベートテキスト*/
CREATE TABLE debate_texts(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    debate_history_id INT NOT NULL,
    text TEXT NOT NULL,
    FOREIGN KEY (debate_history_id) REFERENCES debate_histories(id)
)ENGINE=InnoDB;


/*logic_es*/
CREATE TABLE logic_es(
    debate_history_id INT NOT NULL PRIMARY KEY,
    score INT NOT NULL DEFAULT 0 CHECK (score BETWEEN 0 AND 25),
    feedback TEXT NOT NULL DEFAULT ('フィードバックが生成されていません。'),
    FOREIGN KEY (debate_history_id) REFERENCES debate_histories(id)
)ENGINE=InnoDB;

CREATE TABLE composition_es(
    debate_history_id INT NOT NULL PRIMARY KEY,
    score INT NOT NULL DEFAULT 0 CHECK (score BETWEEN 0 AND 25),
    feedback TEXT NOT NULL DEFAULT ('フィードバックが生成されていません。'),
    FOREIGN KEY (debate_history_id) REFERENCES debate_histories(id)
)ENGINE=InnoDB;
CREATE TABLE rebuttal_es(
    debate_history_id INT NOT NULL PRIMARY KEY,
    score INT NOT NULL DEFAULT 0 CHECK (score BETWEEN 0 AND 25),
    feedback TEXT NOT NULL DEFAULT ('フィードバックが生成されていません。'),
    FOREIGN KEY (debate_history_id) REFERENCES debate_histories(id)
)ENGINE=InnoDB;
CREATE TABLE english_es(
    debate_history_id INT NOT NULL PRIMARY KEY,
    score INT NOT NULL DEFAULT 0 CHECK (score BETWEEN 0 AND 25),
    feedback TEXT NOT NULL DEFAULT ('フィードバックが生成されていません。'),
    FOREIGN KEY (debate_history_id) REFERENCES debate_histories(id)
)ENGINE=InnoDB;
CREATE TABLE general_es(
    debate_history_id INT NOT NULL PRIMARY KEY,
    score INT NOT NULL DEFAULT 0 CHECK (score BETWEEN 0 AND 25),
    feedback TEXT NOT NULL DEFAULT ('フィードバックが生成されていません。'),
    FOREIGN KEY (debate_history_id) REFERENCES debate_histories(id)
)ENGINE=InnoDB;



/*イベント*/
CREATE TABLE events(
    id INT NOT NULL PRIMARY KEY,
    name VARCHAR(100) NOT NULL ,
    debate_mode_id INT NOT NULL,
    start_at DATETIME NOT NULL,
    end_at DATETIME NOT NULL,
    FOREIGN KEY (debate_mode_id) REFERENCES debate_modes(id)
)ENGINE=InnoDB;

/*通報テーブル*/
CREATE TABLE reports(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    reporter_id INT NOT NULL,
    suspect_id INT NOT NULL,
    reason INT NOT NULL,
    comment TEXT NOT NULL,
    FOREIGN KEY (reporter_id) REFERENCES accounts(id),
    FOREIGN KEY (suspect_id) REFERENCES accounts(id)
)ENGINE=InnoDB;


/*総合評価*/
CREATE TABLE total_es(
    account_id INT NOT NULL PRIMARY KEY,
    total_score INT NOT NULL DEFAULT 0,
    advice TEXT NOT NULL DEFAULT ('ディベートを開始しよう！'),
    winning_streak INT NOT NULL DEFAULT 0,
    wins INT NOT NULL DEFAULT 0,
    loses INT NOT NULL DEFAULT 0,
    FOREIGN KEY (account_id) REFERENCES accounts(id)
)ENGINE=InnoDB;

CREATE TABLE tags(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
)ENGINE=InnoDB;

CREATE TABLE topic_tags(
    topic_id INT NOT NULL,
    tag_id INT NOT NULL,
    FOREIGN KEY (topic_id) REFERENCES debate_topics(id),
    FOREIGN KEY (tag_id) REFERENCES tags(id)
)ENGINE=InnoDB;