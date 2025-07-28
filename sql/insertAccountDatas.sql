-- テスト用のアカウントデータ挿入
INSERT INTO accounts(
    name,
    email,
    password,
    img_url,
    created_at
)
VALUES
    ( "伊藤翔太 ", "shota.ito@example.com", "$2b$10$l86Lc1eQL6BeSzyqgW4Z4OnmhANX5j6jOmS66Eaj8Qp4IesFmByNi", "avatar_XL_blue.svg", '2025-07-28 06:37:13' ),
    ( "山田美咲", "misaki.yamada@example.com", "$2b$10$vAVaKcGWRSuNk8UR3XIA..9AKqwPqQysa4FTEkCI/i3ahF.oBlody", "avatar_XL_pink.svg", '2025-07-28 06:38:07'),
    ( "高橋亮太", "ryota.takahashi@example.com", "$2b$10$H2JUJ9WINGfHwevKOzkaQ.TYAJ56IOnTIwD5MnmVLLaeU1ml9JD1m", "avatar_XL_green.svg", '2025-07-28 06:38:59'),
    ( "水田碧", "ao.mizuta@example.com", "$2b$10$6p2RxcD80dR0zIdjHNitiOZH9GMppz3kN9h7b0LjfgS9F0123VaYK", "avatar_XL_purple.svg", '2025-07-28 06:40:59');

-- メールアドレス | 平文パスワード
-- shota.ito@example.com | Sh0ta!Secure
-- misaki.yamada@example.com | Mi$aki2020
-- ryota.takahashi@example.com | Ry0ta#Pass
-- ao.mizuta@example.com | Ao!2wfgd