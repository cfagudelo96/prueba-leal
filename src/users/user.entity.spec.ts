import { User } from './user.entity';

describe('User', () => {
  describe('calculates the user id', () => {
    it('should calculate the user id as te MD5 hash of the email', () => {
      const user = new User({ email: 'cf.agudelo96@gmail.com' });
      user.calculateUserId();
      expect(user.userId).toBe('de87b61c7b6cdccb32edeed3890244ce');
    });
  });

  describe('encrypts the password', () => {
    it('should encrypt the password', async () => {
      const password = 'Test12345';
      const user = new User({ password });
      await user.encryptPassword();
      expect(user.password).not.toBe(password);
    });
  });
});
