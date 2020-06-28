import * as bcrypt from 'bcrypt';

import { User } from './user.entity';

jest.mock('bcrypt');

describe('User', () => {
  it('should calculate the user id as te MD5 hash of the email', () => {
    const user = new User({ email: 'cf.agudelo96@gmail.com' });
    user.calculateUserId();
    expect(user.userId).toBe('de87b61c7b6cdccb32edeed3890244ce');
  });

  it('should encrypt the password', async () => {
    const password = 'Test12345';
    const user = new User({ password });
    await user.encryptPassword();
    expect(user.password).not.toBe(password);
  });

  it('should determine if a given password is the encrypted one', async () => {
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    const password = 'Test12345';
    const passwordProvided = 'No';
    const user = new User({ password });
    const result = await user.isSamePassword(passwordProvided);
    expect(bcrypt.compare).toHaveBeenCalledWith(passwordProvided, password);
    expect(result).toBe(true);
  });
});
