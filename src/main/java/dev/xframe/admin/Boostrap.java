package dev.xframe.admin;

import dev.xframe.admin.conf.SysProperties;
import dev.xframe.boot.Bootstrap;

public class Boostrap {
	
	public static void main(String[] args) {
		new Bootstrap()
			.withName("xframe-admin")
			.include("dev.xframe.*")
			.exclude("dev.xframe.test.*;dev.xframe.jdbc.*")
			.withHttp(SysProperties.get("port", 8001))
			.startup();
	}

}
