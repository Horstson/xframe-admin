package dev.xframe.admin.system.auth;

import java.util.HashSet;
import java.util.Set;

import dev.xframe.admin.system.privilege.Privilege;

public class UserPrivileges {
    
    private String username;
    
    private Set<Privilege> wholePrivileges = new HashSet<>();
    
    private Set<Privilege> privileges = new HashSet<>();
    
    private long lastActiveTime;
    
    public UserPrivileges(String username) {
        this.username = username;
        this.lastActiveTime = System.currentTimeMillis();
    }

    public String getUsername() {
        return username;
    }

    public UserPrivileges add(Privilege privilege, boolean readOnly) {
        if(privilege != null) {
            privileges.add(privilege);
            if(!readOnly) {
                wholePrivileges.add(privilege);
            }
        }
        return this;
    }
    
    public boolean contains(String path) {
        return privileges.stream().filter(p->match(p, path)).findAny().isPresent();
    }
    
    public boolean wholeContains(String path) {
        return wholePrivileges.stream().filter(p->match(p, path)).findAny().isPresent();
    }

    private boolean match(Privilege p, String path) {
        return p.getPath().equals("_") || p.getPath().equals(path) || p.getPath().startsWith(path + "/") || path.startsWith(p.getPath() + "/");
    }

    public long getLastActiveTime() {
        return lastActiveTime;
    }

}
