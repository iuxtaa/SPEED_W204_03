export enum UserDetails {
  minFNameLength = 3,
  minLNameLength = 2,
  minUNameLength = 4,
  minPassLength = 8,
  minPassNum = 1,
  minPassUpperCase = 1,
  minPassLowerCase = 1,
  minPassSymbol = 1,
}

export class UserMessages {
  public static readonly minFNameLengthMessage = `Your first name must be ${UserDetails.minFNameLength} characters long.`;

  public static readonly minLNameLengthMessage = `Your surname must be ${UserDetails.minLNameLength} characters long.`;

  public static readonly minUNameLengthMessage = `Your username must be ${UserDetails.minUNameLength} characters long.`;

  public static readonly minPassLengthMessage = `Your password must be ${UserDetails.minPassLength} characters long.`;

  public static readonly takenCredentialsMessage =
    'The username or email is taken by an existing account. Please use a different one.';

  public static readonly invalidCredentialsMessage =
    'Credentials are invalid. Please try again.';

  public static readonly weakPasswordMessage =
    'This password is too weak. Please try again. Your password must be at least 8 characters long and includes at least 1 number, 1 lowercase character, 1 uppercase character, and 1 symbol.';

  public static readonly passwordMismatchMessage =
    'Passwords do not match. Please try again.';
}
