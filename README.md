# nodejs
1.diff_file.js<br/>
  Compare one directory file change : modify time and file size compare. <br/>
  Command : <br/>
    node /tmp/grace/diff_file.js path/to/directory fileIdx <br/>
  After execute , if some error like no modules, <br/>
  Please use <br/>
  npm install [module name] --verbose<br/>
<p/>
2.express-mysql<br/>
  1) 建立MySQL table<br/>
  -- ###### 11.JBContact 使用者聯絡資訊檔 ######<br/>
DROP TABLE IF EXISTS JBContact;<br/>

CREATE TABLE JBContact (<br/>
  seqNo int(10) NOT NULL AUTO_INCREMENT COMMENT '流水號',<br/>
  userId varchar(20) NOT NULL default '' COMMENT '使用者代碼',<br/>
  cKind int(1) unsigned NOT NULL default '1' COMMENT '聯絡類型 1=email 2=mobile no',<br/>
  contact varchar(50) default '' COMMENT '聯絡內容 ckind=1:填email ckind=2:填mobile no',<br/>
  remark varchar(50) default '' COMMENT '備註',<br/>
  ModifyTime datetime NOT NULL COMMENT '修改時間:時間格式YYYY-MM-DD HH:MM:SS.SSS',<br/>
  ModifyEmp varchar(8) NOT NULL COMMENT '修改人員:員工編號',  <br/>
  PRIMARY KEY (seqNo)<br/>
) COMMENT='使用者聯絡資訊檔';<br/>
<p/>
  2) 執行指令<br/>
  npm start<br/>
<p/>  
  3) 參考說明: http://wp.me/p18o0t-vf<br/>
