import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './views/login/login.component';
import {MainWindowComponent} from './views/main-window/main-window.component';
import {DashboardComponent} from './views/dashboard/dashboard.component';
import {PageNotFoundComponent} from './views/page-not-found/page-not-found.component';
import {UserTableComponent} from './views/modules/user/user-table/user-table.component';
import {UserFormComponent} from './views/modules/user/user-form/user-form.component';
import {UserDetailComponent} from './views/modules/user/user-detail/user-detail.component';
import {UserUpdateFormComponent} from './views/modules/user/user-update-form/user-update-form.component';
import {RoleTableComponent} from './views/modules/role/role-table/role-table.component';
import {RoleFormComponent} from './views/modules/role/role-form/role-form.component';
import {RoleDetailComponent} from './views/modules/role/role-detail/role-detail.component';
import {RoleUpdateFormComponent} from './views/modules/role/role-update-form/role-update-form.component';
import {ChangePasswordComponent} from './views/modules/user/change-password/change-password.component';
import {ResetPasswordComponent} from './views/modules/user/reset-password/reset-password.component';
import {ChangePhotoComponent} from './views/modules/user/change-photo/change-photo.component';
import {MyAllNotificationComponent} from './views/modules/user/my-all-notification/my-all-notification.component';
import {ItemTableComponent} from './views/modules/item/item-table/item-table.component';
import {ItemFormComponent} from './views/modules/item/item-form/item-form.component';
import {ItemDetailComponent} from './views/modules/item/item-detail/item-detail.component';
import {ItemUpdateFormComponent} from './views/modules/item/item-update-form/item-update-form.component';
import {ModificationrequestTableComponent} from './views/modules/modificationrequest/modificationrequest-table/modificationrequest-table.component';
import {ModificationrequestFormComponent} from './views/modules/modificationrequest/modificationrequest-form/modificationrequest-form.component';
import {ModificationrequestDetailComponent} from './views/modules/modificationrequest/modificationrequest-detail/modificationrequest-detail.component';
import {ModificationrequestUpdateFormComponent} from './views/modules/modificationrequest/modificationrequest-update-form/modificationrequest-update-form.component';
import {DiscountTableComponent} from './views/modules/discount/discount-table/discount-table.component';
import {DiscountFormComponent} from './views/modules/discount/discount-form/discount-form.component';
import {DiscountDetailComponent} from './views/modules/discount/discount-detail/discount-detail.component';
import {DiscountUpdateFormComponent} from './views/modules/discount/discount-update-form/discount-update-form.component';
import {DisconnectionrequestTableComponent} from './views/modules/disconnectionrequest/disconnectionrequest-table/disconnectionrequest-table.component';
import {DisconnectionrequestFormComponent} from './views/modules/disconnectionrequest/disconnectionrequest-form/disconnectionrequest-form.component';
import {DisconnectionrequestDetailComponent} from './views/modules/disconnectionrequest/disconnectionrequest-detail/disconnectionrequest-detail.component';
import {DisconnectionrequestUpdateFormComponent} from './views/modules/disconnectionrequest/disconnectionrequest-update-form/disconnectionrequest-update-form.component';
import {EmployeeTableComponent} from './views/modules/employee/employee-table/employee-table.component';
import {EmployeeFormComponent} from './views/modules/employee/employee-form/employee-form.component';
import {EmployeeDetailComponent} from './views/modules/employee/employee-detail/employee-detail.component';
import {EmployeeUpdateFormComponent} from './views/modules/employee/employee-update-form/employee-update-form.component';
import {ReconnectionrequestTableComponent} from './views/modules/reconnectionrequest/reconnectionrequest-table/reconnectionrequest-table.component';
import {ReconnectionrequestFormComponent} from './views/modules/reconnectionrequest/reconnectionrequest-form/reconnectionrequest-form.component';
import {ReconnectionrequestDetailComponent} from './views/modules/reconnectionrequest/reconnectionrequest-detail/reconnectionrequest-detail.component';
import {ReconnectionrequestUpdateFormComponent} from './views/modules/reconnectionrequest/reconnectionrequest-update-form/reconnectionrequest-update-form.component';
import {DisposalTableComponent} from './views/modules/disposal/disposal-table/disposal-table.component';
import {DisposalFormComponent} from './views/modules/disposal/disposal-form/disposal-form.component';
import {DisposalDetailComponent} from './views/modules/disposal/disposal-detail/disposal-detail.component';
import {DisposalUpdateFormComponent} from './views/modules/disposal/disposal-update-form/disposal-update-form.component';
import {ItemreturnTableComponent} from './views/modules/itemreturn/itemreturn-table/itemreturn-table.component';
import {ItemreturnFormComponent} from './views/modules/itemreturn/itemreturn-form/itemreturn-form.component';
import {ItemreturnDetailComponent} from './views/modules/itemreturn/itemreturn-detail/itemreturn-detail.component';
import {ItemreturnUpdateFormComponent} from './views/modules/itemreturn/itemreturn-update-form/itemreturn-update-form.component';
import {TaskallocationTableComponent} from './views/modules/taskallocation/taskallocation-table/taskallocation-table.component';
import {TaskallocationFormComponent} from './views/modules/taskallocation/taskallocation-form/taskallocation-form.component';
import {TaskallocationDetailComponent} from './views/modules/taskallocation/taskallocation-detail/taskallocation-detail.component';
import {TaskallocationUpdateFormComponent} from './views/modules/taskallocation/taskallocation-update-form/taskallocation-update-form.component';
import {VehicleTableComponent} from './views/modules/vehicle/vehicle-table/vehicle-table.component';
import {VehicleFormComponent} from './views/modules/vehicle/vehicle-form/vehicle-form.component';
import {VehicleDetailComponent} from './views/modules/vehicle/vehicle-detail/vehicle-detail.component';
import {VehicleUpdateFormComponent} from './views/modules/vehicle/vehicle-update-form/vehicle-update-form.component';
import {ConnectionrequestTableComponent} from './views/modules/connectionrequest/connectionrequest-table/connectionrequest-table.component';
import {ConnectionrequestFormComponent} from './views/modules/connectionrequest/connectionrequest-form/connectionrequest-form.component';
import {ConnectionrequestDetailComponent} from './views/modules/connectionrequest/connectionrequest-detail/connectionrequest-detail.component';
import {ConnectionrequestUpdateFormComponent} from './views/modules/connectionrequest/connectionrequest-update-form/connectionrequest-update-form.component';
import {ComplaintTableComponent} from './views/modules/complaint/complaint-table/complaint-table.component';
import {ComplaintFormComponent} from './views/modules/complaint/complaint-form/complaint-form.component';
import {ComplaintDetailComponent} from './views/modules/complaint/complaint-detail/complaint-detail.component';
import {ComplaintUpdateFormComponent} from './views/modules/complaint/complaint-update-form/complaint-update-form.component';
import {ConnectionTableComponent} from './views/modules/connection/connection-table/connection-table.component';
import {ConnectionFormComponent} from './views/modules/connection/connection-form/connection-form.component';
import {ConnectionDetailComponent} from './views/modules/connection/connection-detail/connection-detail.component';
import {ConnectionUpdateFormComponent} from './views/modules/connection/connection-update-form/connection-update-form.component';
import {IorderTableComponent} from './views/modules/iorder/iorder-table/iorder-table.component';
import {IorderFormComponent} from './views/modules/iorder/iorder-form/iorder-form.component';
import {IorderDetailComponent} from './views/modules/iorder/iorder-detail/iorder-detail.component';
import {IorderUpdateFormComponent} from './views/modules/iorder/iorder-update-form/iorder-update-form.component';
import {ConnectiontypeTableComponent} from './views/modules/connectiontype/connectiontype-table/connectiontype-table.component';
import {ConnectiontypeFormComponent} from './views/modules/connectiontype/connectiontype-form/connectiontype-form.component';
import {ConnectiontypeDetailComponent} from './views/modules/connectiontype/connectiontype-detail/connectiontype-detail.component';
import {ConnectiontypeUpdateFormComponent} from './views/modules/connectiontype/connectiontype-update-form/connectiontype-update-form.component';
import {ConsumerTableComponent} from './views/modules/consumer/consumer-table/consumer-table.component';
import {ConsumerFormComponent} from './views/modules/consumer/consumer-form/consumer-form.component';
import {ConsumerDetailComponent} from './views/modules/consumer/consumer-detail/consumer-detail.component';
import {ConsumerUpdateFormComponent} from './views/modules/consumer/consumer-update-form/consumer-update-form.component';
import {ItemreciveTableComponent} from './views/modules/itemrecive/itemrecive-table/itemrecive-table.component';
import {ItemreciveFormComponent} from './views/modules/itemrecive/itemrecive-form/itemrecive-form.component';
import {ItemreciveDetailComponent} from './views/modules/itemrecive/itemrecive-detail/itemrecive-detail.component';
import {ItemreciveUpdateFormComponent} from './views/modules/itemrecive/itemrecive-update-form/itemrecive-update-form.component';
import {YearWiseConsumerCountComponent} from './views/modules/reports/year-wise-consumer-count/year-wise-consumer-count.component';
import {YearWiseConnectionCountComponent} from './views/modules/reports/year-wise-connection-count/year-wise-connection-count.component';
import {GramaniladharidivWiseConnectionCountComponent} from './views/modules/reports/gramaniladharidiv-wise-connection-count/gramaniladharidiv-wise-connection-count.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {
    path: '',
    component: MainWindowComponent,
    children: [

      {path: 'users', component: UserTableComponent},
      {path: 'users/add', component: UserFormComponent},
      {path: 'users/change-my-password', component: ChangePasswordComponent},
      {path: 'users/change-my-photo', component: ChangePhotoComponent},
      {path: 'users/my-all-notifications', component: MyAllNotificationComponent},
      {path: 'users/reset-password', component: ResetPasswordComponent},
      {path: 'users/:id', component: UserDetailComponent},
      {path: 'users/edit/:id', component: UserUpdateFormComponent},

      {path: 'roles', component: RoleTableComponent},
      {path: 'roles/add', component: RoleFormComponent},
      {path: 'roles/:id', component: RoleDetailComponent},
      {path: 'roles/edit/:id', component: RoleUpdateFormComponent},

      {path: 'items', component: ItemTableComponent},
      {path: 'items/add', component: ItemFormComponent},
      {path: 'items/:id', component: ItemDetailComponent},
      {path: 'items/edit/:id', component: ItemUpdateFormComponent},

      {path: 'modificationrequests', component: ModificationrequestTableComponent},
      {path: 'modificationrequests/add', component: ModificationrequestFormComponent},
      {path: 'modificationrequests/:id', component: ModificationrequestDetailComponent},
      {path: 'modificationrequests/edit/:id', component: ModificationrequestUpdateFormComponent},

      {path: 'discounts', component: DiscountTableComponent},
      {path: 'discounts/add', component: DiscountFormComponent},
      {path: 'discounts/:id', component: DiscountDetailComponent},
      {path: 'discounts/edit/:id', component: DiscountUpdateFormComponent},

      {path: 'disconnectionrequests', component: DisconnectionrequestTableComponent},
      {path: 'disconnectionrequests/add', component: DisconnectionrequestFormComponent},
      {path: 'disconnectionrequests/:id', component: DisconnectionrequestDetailComponent},
      {path: 'disconnectionrequests/edit/:id', component: DisconnectionrequestUpdateFormComponent},

      {path: 'employees', component: EmployeeTableComponent},
      {path: 'employees/add', component: EmployeeFormComponent},
      {path: 'employees/:id', component: EmployeeDetailComponent},
      {path: 'employees/edit/:id', component: EmployeeUpdateFormComponent},

      {path: 'reconnectionrequests', component: ReconnectionrequestTableComponent},
      {path: 'reconnectionrequests/add', component: ReconnectionrequestFormComponent},
      {path: 'reconnectionrequests/:id', component: ReconnectionrequestDetailComponent},
      {path: 'reconnectionrequests/edit/:id', component: ReconnectionrequestUpdateFormComponent},

      {path: 'disposals', component: DisposalTableComponent},
      {path: 'disposals/add', component: DisposalFormComponent},
      {path: 'disposals/:id', component: DisposalDetailComponent},
      {path: 'disposals/edit/:id', component: DisposalUpdateFormComponent},

      {path: 'itemreturns', component: ItemreturnTableComponent},
      {path: 'itemreturns/add', component: ItemreturnFormComponent},
      {path: 'itemreturns/:id', component: ItemreturnDetailComponent},
      {path: 'itemreturns/edit/:id', component: ItemreturnUpdateFormComponent},

      {path: 'taskallocations', component: TaskallocationTableComponent},
      {path: 'taskallocations/add', component: TaskallocationFormComponent},
      {path: 'taskallocations/:id', component: TaskallocationDetailComponent},
      {path: 'taskallocations/edit/:id', component: TaskallocationUpdateFormComponent},

      {path: 'vehicles', component: VehicleTableComponent},
      {path: 'vehicles/add', component: VehicleFormComponent},
      {path: 'vehicles/:id', component: VehicleDetailComponent},
      {path: 'vehicles/edit/:id', component: VehicleUpdateFormComponent},

      {path: 'connectionrequests', component: ConnectionrequestTableComponent},
      {path: 'connectionrequests/add', component: ConnectionrequestFormComponent},
      {path: 'connectionrequests/:id', component: ConnectionrequestDetailComponent},
      {path: 'connectionrequests/edit/:id', component: ConnectionrequestUpdateFormComponent},

      {path: 'complaints', component: ComplaintTableComponent},
      {path: 'complaints/add', component: ComplaintFormComponent},
      {path: 'complaints/:id', component: ComplaintDetailComponent},
      {path: 'complaints/edit/:id', component: ComplaintUpdateFormComponent},

      {path: 'connections', component: ConnectionTableComponent},
      {path: 'connections/add', component: ConnectionFormComponent},
      {path: 'connections/:id', component: ConnectionDetailComponent},
      {path: 'connections/edit/:id', component: ConnectionUpdateFormComponent},

      {path: 'iorders', component: IorderTableComponent},
      {path: 'iorders/add', component: IorderFormComponent},
      {path: 'iorders/:id', component: IorderDetailComponent},
      {path: 'iorders/edit/:id', component: IorderUpdateFormComponent},

      {path: 'connectiontypes', component: ConnectiontypeTableComponent},
      {path: 'connectiontypes/add', component: ConnectiontypeFormComponent},
      {path: 'connectiontypes/:id', component: ConnectiontypeDetailComponent},
      {path: 'connectiontypes/edit/:id', component: ConnectiontypeUpdateFormComponent},

      {path: 'consumers', component: ConsumerTableComponent},
      {path: 'consumers/add', component: ConsumerFormComponent},
      {path: 'consumers/:id', component: ConsumerDetailComponent},
      {path: 'consumers/edit/:id', component: ConsumerUpdateFormComponent},

      {path: 'itemrecives', component: ItemreciveTableComponent},
      {path: 'itemrecives/add', component: ItemreciveFormComponent},
      {path: 'itemrecives/:id', component: ItemreciveDetailComponent},
      {path: 'itemrecives/edit/:id', component: ItemreciveUpdateFormComponent},

      {path: 'reports/year-wise-consumer-count', component: YearWiseConsumerCountComponent},
      {path: 'reports/year-wise-connection-count', component: YearWiseConnectionCountComponent},
      {path: 'reports/gramaniladharidi-wise-connection-count', component: GramaniladharidivWiseConnectionCountComponent},

      {path: 'dashboard', component: DashboardComponent},
      {path: '', component: DashboardComponent},
    ]
  },
  {path: '**', component: PageNotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
