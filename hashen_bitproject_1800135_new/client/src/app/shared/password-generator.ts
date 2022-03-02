export class PasswordGenerator {

  private static getRandomUpper(): string{
    return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
  }

  private static getRandomLower(): string{
    return String.fromCharCode(Math.floor(Math.random() * 26) + 97);
  }

  private static getRandomNumber(): string{
    return String.fromCharCode(Math.floor(Math.random() * 10) + 48);
  }

  private static getRandomSymbol(): string{
    const symbols = '@#$%!~^&*()+-=[]{}/?'.split('');
    return symbols[Math.floor(Math.random() * symbols.length - 1)];
  }

  static generate(): string{

    const lowerCount = Math.ceil(Math.random() * 2) + 4;
    const upperCount = Math.ceil(Math.random() * 2) + 2;
    const numberCount = Math.ceil(Math.random() * 2) + 1;
    const symbolCount = Math.ceil(Math.random() * 2) + 1;

    const characters: string[] = [];

    for (let i = 0; i < lowerCount; i++) { characters.push(this.getRandomLower()); }
    for (let i = 0; i < upperCount; i++) { characters.push(this.getRandomUpper()); }
    for (let i = 0; i < numberCount; i++) { characters.push(this.getRandomNumber()); }
    for (let i = 0; i < symbolCount; i++) { characters.push(this.getRandomSymbol()); }

    for (let i = characters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * i);
      const temp = characters[i];
      characters[i] = characters[j];
      characters[j] = temp;
    }

    return characters.join('');
  }

}
