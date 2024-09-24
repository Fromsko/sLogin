export namespace model {
	
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
	export class SchoolLoginResp {
	    code: number;
	    msg: string;
	    // Go type: struct { IP string "json:\"ip\""; UID string "json:\"uid\"" }
	    data: any;
	
	    static createFrom(source: any = {}) {
	        return new SchoolLoginResp(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.code = source["code"];
	        this.msg = source["msg"];
	        this.data = this.convertValues(source["data"], Object);
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

