package dev.xframe.admin.system.oplog;

import dev.xframe.utils.XThreadLocal;

public class OpLogUser {
    
    private static XThreadLocal<String> opuser = new XThreadLocal<>();
    
    public static void set(String username) {
        opuser.set(username);
    }
    
    public static String clear() {
        String u = opuser.get();
        opuser.remove();
        return u;
    }

}
