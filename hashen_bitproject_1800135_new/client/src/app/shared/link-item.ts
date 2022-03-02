export class LinkItem {
  title: string;
  path: string;
  icon: string;
  children: LinkItem[] = [];
  usecaseIds: number[] = [];

  constructor(title: string, path: string = null, icon: string = null) {
    this.title = title;
    this.path = path;
    this.icon = icon;
  }

  addUsecaseId(id: number): void{
    this.usecaseIds.push(id);
  }

  getUsecaseIds(): number[]{
    if (this.children.length > 0){
      const usecaseIds = [];
      for (const linkItem of this.children){
        const ids = linkItem.getUsecaseIds();
        for (const id of ids){
          usecaseIds.push(id);
        }
      }
      return usecaseIds.filter((value, index, self) =>  self.indexOf(value) === index);
    }
    return this.usecaseIds;
  }

}
