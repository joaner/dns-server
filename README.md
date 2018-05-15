# [WIP] dns-server
DNS server written by nodejs (work in process)

> [RFC1035: DOMAIN NAMES - IMPLEMENTATION AND SPECIFICATION](https://www.ietf.org/rfc/rfc1035.txt)


## Usage

```bash
$ sudo npm start
server listening 0.0.0.0:53

$ sudo npm stop
```

## TODO

- [ ] parse QTYPE,QCLASS,ANSWER... request
- [ ] build response
- [ ] PM2 control
- [ ] TCP protocol
- [ ] unit test
