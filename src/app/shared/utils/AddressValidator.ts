export class AddressValidator {
  public static isValidWalletAddress(address?: string | null) {
    const regExp = new RegExp(/^0x[a-fA-F0-9]{40}$/);
    return !!address && regExp.test(address);
  }

  public static isNotEmpty(address?: string | null) {
    return address && address?.trim()?.length > 0;
  }
}
