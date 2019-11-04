package dev.xframe.admin.system.oplog;

import java.sql.Timestamp;

public class OpLog {
	
	private String name;//username
	private String path;
	private String params;
	private Timestamp opTime;
	
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getPath() {
        return path;
    }
    public void setPath(String path) {
        this.path = path;
    }
    public String getParams() {
        return params;
    }
    public void setParams(String params) {
        this.params = params;
    }
    public Timestamp getOpTime() {
        return opTime;
    }
    public void setOpTime(Timestamp opTime) {
        this.opTime = opTime;
    }

}