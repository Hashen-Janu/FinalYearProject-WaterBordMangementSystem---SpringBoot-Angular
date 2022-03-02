export class PageRequest {
  pageIndex: number = null;
  pageSize: number = null;
  private searchCriteriaList: SearchCriteria[] = [];

  addSearchCriteria(label: string, value: string): void{
    if (!value) { return; }
    value = value.toString();
    value = value.trim();
    if (!value) { return; }
    const criteria = new SearchCriteria();
    criteria.label = label.replace(',', '\\,').replace(':', '\\:');
    criteria.value = value.replace(',', '\\,').replace(':', '\\:');
    this.searchCriteriaList.push(criteria);
  }

  getPageRequestURL(url: string): string{
    const segments: string[] = [];

    if (this.pageIndex !== null) { segments.push(`page=${this.pageIndex}`); }
    if (this.pageSize !== null) { segments.push(`size=${this.pageSize}`); }
    if (this.searchCriteriaList.length > 0) {
        let queryText = '';
        this.searchCriteriaList.forEach((criteria, index) => {
          queryText += criteria.label + ':' + criteria.value;
          if ((index + 1) !== this.searchCriteriaList.length){ queryText += ','; }
        });
        if (queryText !== ''){
          segments.push('query=' + encodeURI(queryText));
        }
    }

    if (segments.length > 0) { url += '?' + segments.join('&'); }
    return url;
  }

}

class SearchCriteria {
  label: string;
  value: string;
}
