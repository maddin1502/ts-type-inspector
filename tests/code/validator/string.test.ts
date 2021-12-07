import { JestClassExtended } from 'jest-class-extended';
import tva from '../../../src';
import { StringValidator } from '../../../src/validator/string';

const jce = new JestClassExtended(StringValidator);

jce.describe(() => {
  jce.test(
    ['isValid', 'success'],
    2,
    () => {
      expect(tva.string.isValid('hello world')).toBe(true);
      expect(tva.string.isValid(`hello ${'world'}`)).toBe(true);
    }
  );

  jce.test(
    ['isValid', 'failure'],
    8,
    () => {
      expect(tva.string.isValid(undefined)).toBe(false);
      expect(tva.string.isValid(null)).toBe(false);
      expect(tva.string.isValid(42)).toBe(false);
      expect(tva.string.isValid(true)).toBe(false);
      expect(tva.string.isValid({ oh: 'no'})).toBe(false);
      expect(tva.string.isValid(/.*oh.*no:+/)).toBe(false);
      expect(tva.string.isValid(() => ({ oh: 'no'}))).toBe(false);
      expect(tva.string.isValid('')).toBe(false);
    }
  );

  jce.test(
    ['isValid', 'correct conditions'],
    27,
    () => {
      expect(tva.string.length(5).isValid('hello')).toBe(true);
      expect(tva.string.length(5).max(6).isValid('hello')).toBe(true);
      expect(tva.string.length(5).min(4).isValid('hello')).toBe(true);
      expect(tva.string.max(6).min(4).isValid('hello')).toBe(true);
      expect(tva.string.allow('world', 'hello').isValid('hello')).toBe(true);
      expect(tva.string.allow('world', /.*hello.*/).isValid('hello')).toBe(true);
      expect(tva.string.deny('world').isValid('hello')).toBe(true);
      expect(tva.string.custom(value_ => value_.endsWith('o') ? undefined : 'invalid').isValid('hello')).toBe(true);
      expect(tva.string.allowEmpty.isValid('')).toBe(true);
      expect(tva.string.json.isValid('{ "hello": "world" }')).toBe(true);
      expect(tva.string.base64.isValid('eyAiaGVsbG8iOiAid29ybGQiIH0=')).toBe(true);
      expect(tva.string.date.isValid('2021-01-01')).toBe(true);
      expect(tva.string.numeric.isValid('42')).toBe(true);
      expect(tva.string.uuid.isValid('0cceef42-6b9b-4150-828a-501ef1299578')).toBe(true);
      expect(tva.string.email.isValid('email@example.com')).toBe(true); // just a simple test... @sideway/address will do the job

      // just a few simple tests... @sideway/address will do the job
      expect(tva.string.uri.isValid('https://github.com/sideway/address')).toBe(true);
      expect(tva.string.uri.isValid('ftp://ftp.is.co.za/rfc/rfc1808.txt')).toBe(true);
      expect(tva.string.uri.isValid('http://www.ietf.org/rfc/rfc2396.txt')).toBe(true);
      expect(tva.string.uri.isValid('ldap://[2001:db8::7]/c=GB?objectClass?one')).toBe(true);
      expect(tva.string.uri.isValid('news:comp.infosystems.www.servers.unix')).toBe(true);
      expect(tva.string.uri.isValid('tel:+1-816-555-1212')).toBe(true);
      expect(tva.string.uri.isValid('telnet://192.0.2.16:80/')).toBe(true);
      expect(tva.string.uri.isValid('urn:oasis:names:specification:docbook:dtd:xml:4.1.2')).toBe(true);

      expect(tva.string.url.isValid('https://github.com/sideway/address')).toBe(true);
      expect(tva.string.url.isValid('http://www.ietf.org/rfc/rfc2396.txt')).toBe(true);
      expect(tva.string.url.isValid('ftp://ftp.is.co.za/rfc/rfc1808.txt')).toBe(true);
      expect(tva.string.url.isValid('ldap://[2001:db8::7]/c=GB?objectClass?one')).toBe(true);
      expect(tva.string.url.isValid('news:comp.infosystems.www.servers.unix')).toBe(true);
      expect(tva.string.url.isValid('tel:+1-816-555-1212')).toBe(true);
      expect(tva.string.url.isValid('telnet://192.0.2.16:80/')).toBe(true);
      expect(tva.string.url.isValid('urn:oasis:names:specification:docbook:dtd:xml:4.1.2')).toBe(true);
      expect(tva.string.url.isValid('urn:ISBN:3-8233-4429-1')).toBe(true);
    }
  );

  jce.test(
    ['isValid', 'incorrect conditions'],
    15,
    () => {
      expect(tva.string.length(6).isValid('hello')).toBe(false);
      expect(tva.string.length(5).max(4).isValid('hello')).toBe(false);
      expect(tva.string.length(5).min(6).isValid('hello')).toBe(false);
      expect(tva.string.max(4).min(6).isValid('hello')).toBe(false);
      expect(tva.string.allow('world').isValid('hello')).toBe(false);
      expect(tva.string.allow('world', /.+hello.+/).isValid('hello')).toBe(false);
      expect(tva.string.deny('hello').isValid('hello')).toBe(false);
      expect(tva.string.custom(value_ => value_.endsWith('d') ? undefined : 'invalid').isValid('hello')).toBe(false);
      expect(tva.string.json.isValid('{ "hello": world }')).toBe(false);
      expect(tva.string.base64.isValid('eyAiaGVsbG8iOiAid29ybGQiIH0')).toBe(false);
      expect(tva.string.date.isValid('20210101')).toBe(false);
      expect(tva.string.numeric.isValid('42+42')).toBe(false);
      expect(tva.string.uuid.isValid('0cceef42-6b9b-4150828a-501ef1299578')).toBe(false);
      expect(tva.string.email.isValid('email@examplecom')).toBe(false); // just a simple test... @sideway/address will do the job

      expect(tva.string.url.isValid('news:comp.infosystems.www.servers.unix')).toBe(false);
      expect(tva.string.url.isValid('tel:+1-816-555-1212')).toBe(false);
      expect(tva.string.url.isValid('telnet://192.0.2.16:80/')).toBe(false);
      expect(tva.string.url.isValid('urn:oasis:names:specification:docbook:dtd:xml:4.1.2')).toBe(false);

      // just a few simple tests... @sideway/address will do the job
      expect(tva.string.uri.isValid('https//github.com/sideway/address')).toBe(false);
      expect(tva.string.uri.isValid('ftp//ftp.is.co.za/rfc/rfc1808.txt')).toBe(false);
      expect(tva.string.uri.isValid('http//www.ietf.org/rfc/rfc2396.txt')).toBe(false);
      expect(tva.string.uri.isValid('ldap//[2001:db8::7]/c=GB?objectClass?one')).toBe(false);
      expect(tva.string.uri.isValid('newscomp.infosystems.www.servers.unix')).toBe(false);
      expect(tva.string.uri.isValid('tel+1-816-555-1212')).toBe(false);
      expect(tva.string.uri.isValid('telnet//192.0.2.16:80/')).toBe(false);
      expect(tva.string.uri.isValid('urn.oasis:names:specification:docbook:dtd:xml:4.1.2')).toBe(false);
    }
  );
});
