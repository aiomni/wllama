package main

import (
	"log"
	"net"
	"os"
	"os/signal"
	"syscall"

	"github.com/grandcat/zeroconf"
)

func main() {
	// 定义服务参数：
	// 实例名为 "xllama"，对应解析结果将呈现为 xllama._myservice._tcp.local.
	instance := "xllama"
	// 自定义服务类型（注意必须以下划线开头），例如 "_myservice._tcp"
	serviceType := "_http._tcp"
	// mDNS 默认域名
	domain := "local."
	// 服务端口
	port := 8158
	// 自定义 TXT 记录，附带一些服务说明信息
	txtRecords := []string{"version=1.0", "description=xllama mDNS Service"}

	// 如果希望指定特定 IP（例如网卡 IP），可以构造 IP 数组，否则传 nil 则会自动获取本机 IP
	// ips := []net.IP{net.ParseIP("192.168.1.100")}
	var ips []net.Interface = nil

	// 启动 mDNS 服务注册
	server, err := zeroconf.Register(instance, serviceType, domain, port, txtRecords, ips)
	if err != nil {
		log.Fatalf("启动 mDNS 服务失败: %v", err)
	}
	// 确保程序退出时关闭服务
	defer server.Shutdown()

	log.Printf("mDNS 服务已启动：%s.%s%s，端口: %d", instance, serviceType, domain, port)

	// 阻塞等待退出信号（Ctrl+C）
	sig := make(chan os.Signal, 1)
	signal.Notify(sig, syscall.SIGINT, syscall.SIGTERM)
	<-sig

	log.Println("服务关闭")
}
