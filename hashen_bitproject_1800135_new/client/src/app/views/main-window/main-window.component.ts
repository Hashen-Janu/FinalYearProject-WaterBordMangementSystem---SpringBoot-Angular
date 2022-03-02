import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {Router} from '@angular/router';
import {TokenManager} from '../../shared/security/token-manager';
import {AuthenticationService} from '../../shared/authentication.service';
import {LoggedUser} from '../../shared/logged-user';
import {LinkItem} from '../../shared/link-item';
import {ThemeManager} from '../../shared/views/theme-manager';
import {UsecaseList} from '../../usecase-list';
import {NotificationService} from '../../services/notification.service';
import {PrimeNumbers} from '../../shared/prime-numbers';
import {Notification} from '../../entities/notification';

@Component({
  selector: 'app-main-window',
  templateUrl: './main-window.component.html',
  styleUrls: ['./main-window.component.scss']
})
export class MainWindowComponent implements OnInit, OnDestroy {

  constructor(
    private userService: UserService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private notificationService: NotificationService
  ) {
    if (!TokenManager.isContainsToken()){
      this.router.navigateByUrl('/login');
    }
  }

  get loggedUserName(): string{
    return LoggedUser.getName();
  }

  get loggedUserPhoto(): string{
    return LoggedUser.getPhoto();
  }

  refreshRate = PrimeNumbers.getRandomNumber();
  unreadNotificationCount = '0';
  isLive = true;
  sidenavOpen = false;
  sidenaveMode = 'side';
  usecasesLoaded = false;
  linkItems: LinkItem[] = [];
  isDark: boolean;
  latestNotifications: Notification[] = [];

  async loadData(): Promise<void>{
    this.notificationService.getUnreadCount().then((count) => {
      if (count > 99) { this.unreadNotificationCount = '99+'; }
      else{ this.unreadNotificationCount = count.toString(); }
    }).catch((e) => {
      console.log(e);
    });

    this.notificationService.getLatest().then(async (data) => {
      this.latestNotifications = data;
      for (const notification of data){
        if (!notification.dodelivered){
          await this.notificationService.setDelivered(notification.id);
        }
      }
    }).catch((e) => {
      console.log(e);
    });

  }

  setNotificationsAsRead(): void{
    for (const notification of this.latestNotifications){
      if (!notification.doread){
        this.notificationService.setRead(notification.id);
      }
    }
  }

  refreshData(): void{
    setTimeout( async () => {
      if (!this.isLive) { return; }
      try{
        await this.loadData();
      }finally {
        this.refreshData();
      }
    }, this.refreshRate);
  }

  async ngOnInit(): Promise<void> {
    this.userService.me().then((user) => {
      LoggedUser.user = user;
    });
    this.userService.myUsecases().then((usecases) => {
      LoggedUser.usecases = usecases;
      this.setLinkItems();
      this.usecasesLoaded = true;
    });
    this.setSidenavSettings();
    this.isDark = ThemeManager.isDark();
    await this.loadData();
    this.refreshData();
  }

  async logout(): Promise<void>{
    await this.authenticationService.destroyToken();
    TokenManager.destroyToken();
    LoggedUser.clear();
    this.router.navigateByUrl('/login');
  }

  setSidenavSettings(): void{
    const width = window.innerWidth;
    if (width < 992){
      this.sidenavOpen = false;
      this.sidenaveMode = 'over';
    }else{
      this.sidenavOpen = true;
      this.sidenaveMode = 'side';
    }
  }

  private setLinkItems(): void{
    const dashboardLink = new LinkItem('Dashboard', '/', 'dashboard');
    const userLink = new LinkItem('User Management', '', 'admin_panel_settings');
    const roleLink = new LinkItem('Role Management', '', 'assignment_ind');
    const reportLink = new LinkItem('Report ', '', 'analytc');

    const discountLink = new LinkItem('Discount Management', '/', 'monetization_on');
    const iorderLink = new LinkItem('Iorder Management', '/', 'trip_origin');
    const connectionLink = new LinkItem('Connection Management', '/', 'compare_arrows');
    const disposalLink = new LinkItem('Disposal Management', '/', 'trip_origin');
    const itemreciveLink = new LinkItem('Itemrecive Management', '/', 'trip_origin');
    const disconnectionrequestLink = new LinkItem('Disconnectionrequest Management', '/', 'highlight_off');
    const vehicleLink = new LinkItem('Vehicle Management', '/', 'directions_car_filled');
    const itemLink = new LinkItem('Item Management', '/', 'trip_origin');
    const connectiontypeLink = new LinkItem('Connectiontype Management', '/', 'trip_origin');
    const employeeLink = new LinkItem('Employee Management', '/', 'supervised_user_circle');
    const consumerLink = new LinkItem('Consumer Management', '/', 'perm_identity');
    const taskallocationLink = new LinkItem('Taskallocation Management', '/', 'add_task');
    const connectionrequestLink = new LinkItem('Connection Estimate Management', '/', 'trip_origin');
    const modificationrequestLink = new LinkItem('Modificationrequest Management', '/', 'published_with_changes');
    const reconnectionrequestLink = new LinkItem('Reconnectionrequest Management', '/', 'check_circle');
    const complaintLink = new LinkItem('Complaint Management', '/', 'error');
    const itemreturnLink = new LinkItem('Itemreturn Management', '/', 'trip_origin');
    const inventoryLink = new LinkItem('Inventory Management', '', 'inventory_2');


    const showUserLink = new LinkItem('Show All Users', '/users', 'list');
    showUserLink.addUsecaseId(UsecaseList.SHOW_ALL_USERS);
    userLink.children.push(showUserLink);

    const addUserLink = new LinkItem('Add New User', '/users/add', 'add');
    addUserLink.addUsecaseId(UsecaseList.ADD_USER);
    userLink.children.push(addUserLink);

    const showRoleLink = new LinkItem('Show All Roles', '/roles', 'list');
    showRoleLink.addUsecaseId(UsecaseList.SHOW_ALL_ROLES);
    roleLink.children.push(showRoleLink);

    const addRoleLink = new LinkItem('Add New Role', '/roles/add', 'add');
    addRoleLink.addUsecaseId(UsecaseList.ADD_ROLE);
    roleLink.children.push(addRoleLink);

    const addNewDiscountLink = new LinkItem('Add New Discount', 'discounts/add', 'add');
    addNewDiscountLink.addUsecaseId(UsecaseList.ADD_DISCOUNT);
    discountLink.children.push(addNewDiscountLink);

    const showAllDiscountLink = new LinkItem('Show All Discount', 'discounts', 'list');
    showAllDiscountLink.addUsecaseId(UsecaseList.SHOW_ALL_DISCOUNTS);
    discountLink.children.push(showAllDiscountLink);

    const addNewIorderLink = new LinkItem('Add New Iorder', 'iorders/add', 'add');
    addNewIorderLink.addUsecaseId(UsecaseList.ADD_IORDER);
    iorderLink.children.push(addNewIorderLink);

    const showAllIorderLink = new LinkItem('Show All Iorder', 'iorders', 'list');
    showAllIorderLink.addUsecaseId(UsecaseList.SHOW_ALL_IORDERS);
    iorderLink.children.push(showAllIorderLink);

    const addNewConnectionLink = new LinkItem('Add New Connection', 'connections/add', 'add');
    addNewConnectionLink.addUsecaseId(UsecaseList.ADD_CONNECTION);
    connectionLink.children.push(addNewConnectionLink);

    const showAllConnectionLink = new LinkItem('Show All Connection', 'connections', 'list');
    showAllConnectionLink.addUsecaseId(UsecaseList.SHOW_ALL_CONNECTIONS);
    connectionLink.children.push(showAllConnectionLink);

    const addNewDisposalLink = new LinkItem('Add New Disposal', 'disposals/add', 'add');
    addNewDisposalLink.addUsecaseId(UsecaseList.ADD_DISPOSAL);
    disposalLink.children.push(addNewDisposalLink);

    const showAllDisposalLink = new LinkItem('Show All Disposal', 'disposals', 'list');
    showAllDisposalLink.addUsecaseId(UsecaseList.SHOW_ALL_DISPOSALS);
    disposalLink.children.push(showAllDisposalLink);

    const addNewItemreciveLink = new LinkItem('Add New Itemrecive', 'itemrecives/add', 'add');
    addNewItemreciveLink.addUsecaseId(UsecaseList.ADD_ITEMRECIVE);
    itemreciveLink.children.push(addNewItemreciveLink);

    const showAllItemreciveLink = new LinkItem('Show All Itemrecive', 'itemrecives', 'list');
    showAllItemreciveLink.addUsecaseId(UsecaseList.SHOW_ALL_ITEMRECIVES);
    itemreciveLink.children.push(showAllItemreciveLink);

    const addNewDisconnectionrequestLink = new LinkItem('Add New Disconnectionrequest', 'disconnectionrequests/add', 'add');
    addNewDisconnectionrequestLink.addUsecaseId(UsecaseList.ADD_DISCONNECTIONREQUEST);
    disconnectionrequestLink.children.push(addNewDisconnectionrequestLink);

    const showAllDisconnectionrequestLink = new LinkItem('Show All Disconnectionrequest', 'disconnectionrequests', 'list');
    showAllDisconnectionrequestLink.addUsecaseId(UsecaseList.SHOW_ALL_DISCONNECTIONREQUESTS);
    disconnectionrequestLink.children.push(showAllDisconnectionrequestLink);

    const addNewVehicleLink = new LinkItem('Add New Vehicle', 'vehicles/add', 'add');
    addNewVehicleLink.addUsecaseId(UsecaseList.ADD_VEHICLE);
    vehicleLink.children.push(addNewVehicleLink);

    const showAllVehicleLink = new LinkItem('Show All Vehicle', 'vehicles', 'list');
    showAllVehicleLink.addUsecaseId(UsecaseList.SHOW_ALL_VEHICLES);
    vehicleLink.children.push(showAllVehicleLink);

    const addNewItemLink = new LinkItem('Add New Item', 'items/add', 'add');
    addNewItemLink.addUsecaseId(UsecaseList.ADD_ITEM);
    itemLink.children.push(addNewItemLink);

    const showAllItemLink = new LinkItem('Show All Item', 'items', 'list');
    showAllItemLink.addUsecaseId(UsecaseList.SHOW_ALL_ITEMS);
    itemLink.children.push(showAllItemLink);

    const addNewConnectiontypeLink = new LinkItem('Add New Connectiontype', 'connectiontypes/add', 'add');
    addNewConnectiontypeLink.addUsecaseId(UsecaseList.ADD_CONNECTIONTYPE);
    connectiontypeLink.children.push(addNewConnectiontypeLink);

    const showAllConnectiontypeLink = new LinkItem('Show All Connectiontype', 'connectiontypes', 'list');
    showAllConnectiontypeLink.addUsecaseId(UsecaseList.SHOW_ALL_CONNECTIONTYPES);
    connectiontypeLink.children.push(showAllConnectiontypeLink);

    const addNewEmployeeLink = new LinkItem('Add New Employee', 'employees/add', 'add');
    addNewEmployeeLink.addUsecaseId(UsecaseList.ADD_EMPLOYEE);
    employeeLink.children.push(addNewEmployeeLink);

    const showAllEmployeeLink = new LinkItem('Show All Employee', 'employees', 'list');
    showAllEmployeeLink.addUsecaseId(UsecaseList.SHOW_ALL_EMPLOYEES);
    employeeLink.children.push(showAllEmployeeLink);

    const addNewConsumerLink = new LinkItem('Add New Consumer', 'consumers/add', 'add');
    addNewConsumerLink.addUsecaseId(UsecaseList.ADD_CONSUMER);
    consumerLink.children.push(addNewConsumerLink);

    const showAllConsumerLink = new LinkItem('Show All Consumer', 'consumers', 'list');
    showAllConsumerLink.addUsecaseId(UsecaseList.SHOW_ALL_CONSUMERS);
    consumerLink.children.push(showAllConsumerLink);

    const addNewTaskallocationLink = new LinkItem('Add New Taskallocation', 'taskallocations/add', 'add');
    addNewTaskallocationLink.addUsecaseId(UsecaseList.ADD_TASKALLOCATION);
    taskallocationLink.children.push(addNewTaskallocationLink);

    const showAllTaskallocationLink = new LinkItem('Show All Taskallocation', 'taskallocations', 'list');
    showAllTaskallocationLink.addUsecaseId(UsecaseList.SHOW_ALL_TASKALLOCATIONS);
    taskallocationLink.children.push(showAllTaskallocationLink);

    const addNewConnectionrequestLink = new LinkItem('Add New Connection estimate', 'connectionrequests/add', 'add');
    addNewConnectionrequestLink.addUsecaseId(UsecaseList.ADD_CONNECTIONREQUEST);
    connectionrequestLink.children.push(addNewConnectionrequestLink);

    const showAllConnectionrequestLink = new LinkItem('Show All  Connection estimate', 'connectionrequests', 'list');
    showAllConnectionrequestLink.addUsecaseId(UsecaseList.SHOW_ALL_CONNECTIONREQUESTS);
    connectionrequestLink.children.push(showAllConnectionrequestLink);

    const addNewModificationrequestLink = new LinkItem('Add New Modificationrequest', 'modificationrequests/add', 'add');
    addNewModificationrequestLink.addUsecaseId(UsecaseList.ADD_MODIFICATIONREQUEST);
    modificationrequestLink.children.push(addNewModificationrequestLink);

    const showAllModificationrequestLink = new LinkItem('Show All Modificationrequest', 'modificationrequests', 'list');
    showAllModificationrequestLink.addUsecaseId(UsecaseList.SHOW_ALL_MODIFICATIONREQUESTS);
    modificationrequestLink.children.push(showAllModificationrequestLink);

    const addNewReconnectionrequestLink = new LinkItem('Add New Reconnectionrequest', 'reconnectionrequests/add', 'add');
    addNewReconnectionrequestLink.addUsecaseId(UsecaseList.ADD_RECONNECTIONREQUEST);
    reconnectionrequestLink.children.push(addNewReconnectionrequestLink);

    const showAllReconnectionrequestLink = new LinkItem('Show All Reconnectionrequest', 'reconnectionrequests', 'list');
    showAllReconnectionrequestLink.addUsecaseId(UsecaseList.SHOW_ALL_RECONNECTIONREQUESTS);
    reconnectionrequestLink.children.push(showAllReconnectionrequestLink);

    const addNewComplaintLink = new LinkItem('Add New Complaint', 'complaints/add', 'add');
    addNewComplaintLink.addUsecaseId(UsecaseList.ADD_COMPLAINT);
    complaintLink.children.push(addNewComplaintLink);

    const showAllComplaintLink = new LinkItem('Show All Complaint', 'complaints', 'list');
    showAllComplaintLink.addUsecaseId(UsecaseList.SHOW_ALL_COMPLAINTS);
    complaintLink.children.push(showAllComplaintLink);

    const addNewItemreturnLink = new LinkItem('Add New Itemreturn', 'itemreturns/add', 'add');
    addNewItemreturnLink.addUsecaseId(UsecaseList.ADD_ITEMRETURN);
    itemreturnLink.children.push(addNewItemreturnLink);

    const showAllItemreturnLink = new LinkItem('Show All Itemreturn', 'itemreturns', 'list');
    showAllItemreturnLink.addUsecaseId(UsecaseList.SHOW_ALL_ITEMRETURNS);
    itemreturnLink.children.push(showAllItemreturnLink);

    const showYearWiseConsumerCountLink = new LinkItem('Show All Year Wise Consumer Count', 'reports/year-wise-consumer-count', 'list');
    showYearWiseConsumerCountLink.addUsecaseId(UsecaseList.SHOW_YEAR_WISE_CONSUMER_COUNT);
    reportLink.children.push(showYearWiseConsumerCountLink);

    const showYearWiseConnectionCountLink = new LinkItem('Show All Year Wise Connection Count', 'reports/year-wise-connection-count', 'list');
    showYearWiseConnectionCountLink.addUsecaseId(UsecaseList.SHOW_YEAR_WISE_CONNECTION_COUNT);
    reportLink.children.push(showYearWiseConnectionCountLink);

    const showGramaniladhariDivWiseConnectionCountLink = new LinkItem('Show All Gramaniladhari Division Wise Connection Count', 'reports/gramaniladharidi-wise-connection-count', 'list');
    showGramaniladhariDivWiseConnectionCountLink.addUsecaseId(UsecaseList.SHOW_YEAR_WISE_CONNECTION_COUNT);
    reportLink.children.push(showGramaniladhariDivWiseConnectionCountLink);

    inventoryLink.children.push(itemLink);
    inventoryLink.children.push(iorderLink);
    inventoryLink.children.push(itemreciveLink);
    inventoryLink.children.push(itemreturnLink);
    inventoryLink.children.push(disposalLink);

    this.linkItems.push(dashboardLink);
    this.linkItems.push(userLink);
    this.linkItems.push(roleLink);
    this.linkItems.push(employeeLink);
    this.linkItems.push(consumerLink);
    this.linkItems.push(connectionrequestLink);
    this.linkItems.push(connectionLink);
    this.linkItems.push(inventoryLink);
    this.linkItems.push(vehicleLink);
    this.linkItems.push(taskallocationLink);
    this.linkItems.push(complaintLink);
    this.linkItems.push(discountLink);
    this.linkItems.push(connectiontypeLink);
    this.linkItems.push(reconnectionrequestLink);
    this.linkItems.push(disconnectionrequestLink);
    this.linkItems.push(modificationrequestLink);
    this.linkItems.push(reportLink);



  }

  changeTheme(e): void{
    if (e.checked){
      ThemeManager.setDark(true);
      this.isDark = true;
    }else{
      ThemeManager.setDark(false);
      this.isDark = false;
    }
  }

  ngOnDestroy(): void {
    this.isLive = false;
  }
}
