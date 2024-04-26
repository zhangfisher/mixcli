 
/**
 *
 * 用来实现一些与环境相关的功能,包括:
 *
 * - 侦听退出事件
 * - 侦听未捕获的全局异常
 *
 */
import { APP_EXIT_EVENT, Environment  } from '@voerka/core';  
const stopSignals = [
	"exit",
	"SIGHUP",
	"SIGINT", 
	"SIGQUIT",
	"SIGILL",
	"SIGTRAP",
	"SIGABRT",
	"SIGBUS",
	"SIGFPE",
	"SIGUSR1",
	"SIGSEGV",
	"SIGUSR2",
	"SIGTERM"
];
 
export class NodejsEnvironment extends Environment{
	constructor() {
		super();		
		stopSignals.forEach(signal=>{
			process.on(signal,async ()=>await this.onExit.call(this,signal));
		}) 
		process.on("uncaughtException", this.onError.bind(this));
	} 
	async onExit(signal?:string) {
		await this.emitAsync(APP_EXIT_EVENT, null, true);
	}
	private onError(e: Error) {		
		this.emit("error", e, true);
	}   
}
  