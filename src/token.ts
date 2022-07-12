function tokenToAuthUserId(token: string, tokenValid: boolean): number {
  if (!tokenValid) {
    return null;
  }
  // Check if token is a float
  // This could be improved later
  if (token.includes('.')) {
    const testToken = token.replace('.', '');
    // Check if remaining is a number
    if ((testToken.match(/^\d+$/)) === null) {
      return null;
    }
  } else {
    return null;
  }

  const tokenSplit = token.split('.');
  if (tokenSplit.length !== 2) {
    return null;
  }
  const authUserId = parseInt(tokenSplit[0]);

  return authUserId;
}

export { tokenToAuthUserId };
