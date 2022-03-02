export class ThemeManager {

  static isDark(): boolean {
    const isDark = localStorage.getItem('is_dark');
    const body = document.getElementsByTagName('body')[0];
    if (isDark === 'true') {
      body.classList.add('dark');
      body.classList.remove('light');
      return true;
    }
    body.classList.add('light');
    body.classList.remove('dark');
    return false;
  }

  static setDark(value: boolean = true): void{
    const body = document.getElementsByTagName('body')[0];
    if (value){
      localStorage.setItem('is_dark', 'true');
      body.classList.add('dark');
      body.classList.remove('light');
    }else{
      localStorage.setItem('is_dark', 'false');
      body.classList.add('light');
      body.classList.remove('dark');
    }
  }

}
