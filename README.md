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

- [x] parse QTYPE,QCLASS,ANSWER... request
- [x] build response
- [ ] parent DNS server
- [ ] PM2 control
- [ ] TCP protocol
- [ ] unit test
