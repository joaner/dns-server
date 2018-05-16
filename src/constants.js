/**
 * defiend in https://www.ietf.org/rfc/rfc1035.txt
 */

// 3.2.2. TYPE values
export const TYPES = {
  A     : 1,  // a host address
  NS    : 2,  // an authoritative name server
  MD    : 3,  // a mail destination (Obsolete - use MX)
  MF    : 4,  // a mail forwarder (Obsolete - use MX)
  CNAME : 5,  // the canonical name for an alias
  SOA   : 6,  // marks the start of a zone of authority
  MB    : 7,  // a mailbox domain name (EXPERIMENTAL)
  MG    : 8,  // a mail group member (EXPERIMENTAL)
  MR    : 9,  // a mail rename domain name (EXPERIMENTAL)
  NULL  : 10, // a null RR (EXPERIMENTAL)
  WKS   : 11, // a well known service description
  PTR   : 12, // a domain name pointer
  HINFO : 13, // host information
  MINFO : 14, // mailbox or mail list information
  MX    : 15, // mail exchange
  TXT   : 16, // text strings
}

// 3.2.3. QTYPE values
export const QTYPES = {
  ...TYPES,
  AXFR  : 252, // A request for a transfer of an entire zone
  MAILB : 253, // A request for mailbox-related records (MB, MG or MR)
  MAILA : 254, // A request for mail agent RRs (Obsolete - see MX)
  *     : 255, // A request for all records
}

// 3.2.4. CLASS values
export const CLASSES = {
  IN    : 1, // the Internet
  CS    : 2, // the CSNET class (Obsolete - used only for examples in some obsolete RFCs)
  CH    : 3, // the CHAOS class
  HS    : 4, // Hesiod [Dyer 87]
}

// 3.2.5. QCLASS values
export const QCLASSES = {
  ...CLASSES,
  *     : 255, // any class
}
