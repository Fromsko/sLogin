export namespace model {
	
	export class DisplayInfo {
	    host: string;
	    title: string;
	    author: string;
	    github: string;
	    version: string;
	    proxy: string;
	
	    static createFrom(source: any = {}) {
	        return new DisplayInfo(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.host = source["host"];
	        this.title = source["title"];
	        this.author = source["author"];
	        this.github = source["github"];
	        this.version = source["version"];
	        this.proxy = source["proxy"];
	    }
	}
	export class NotifyData {
	    data: string;
	    title: string;
	
	    static createFrom(source: any = {}) {
	        return new NotifyData(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.data = source["data"];
	        this.title = source["title"];
	    }
	}
	export class UserData {
	    ip: string;
	    uid: string;
	
	    static createFrom(source: any = {}) {
	        return new UserData(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ip = source["ip"];
	        this.uid = source["uid"];
	    }
	}
	export class SchoolLoginResp {
	    code: number;
	    msg: string;
	    data: UserData;
	
	    static createFrom(source: any = {}) {
	        return new SchoolLoginResp(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.code = source["code"];
	        this.msg = source["msg"];
	        this.data = this.convertValues(source["data"], UserData);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	export class UserInfo {
	    client: string;
	    username: string;
	    password: string;
	
	    static createFrom(source: any = {}) {
	        return new UserInfo(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.client = source["client"];
	        this.username = source["username"];
	        this.password = source["password"];
	    }
	}

}

