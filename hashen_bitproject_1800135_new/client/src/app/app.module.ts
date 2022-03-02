import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {NgbDropdownModule, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './views/login/login.component';
import { MainWindowComponent } from './views/main-window/main-window.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { PageNotFoundComponent } from './views/page-not-found/page-not-found.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import { PageHeaderComponent } from './shared/views/page-header/page-header.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {Interceptor} from './shared/interceptor';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatBadgeModule} from '@angular/material/badge';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatListModule} from '@angular/material/list';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatTreeModule} from '@angular/material/tree';
import { NavigationComponent } from './shared/views/navigation/navigation.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { RoleDetailComponent } from './views/modules/role/role-detail/role-detail.component';
import { RoleFormComponent } from './views/modules/role/role-form/role-form.component';
import { RoleTableComponent } from './views/modules/role/role-table/role-table.component';
import { RoleUpdateFormComponent } from './views/modules/role/role-update-form/role-update-form.component';
import { UserDetailComponent } from './views/modules/user/user-detail/user-detail.component';
import { UserFormComponent } from './views/modules/user/user-form/user-form.component';
import { UserTableComponent } from './views/modules/user/user-table/user-table.component';
import { UserUpdateFormComponent } from './views/modules/user/user-update-form/user-update-form.component';
import { ChangePasswordComponent } from './views/modules/user/change-password/change-password.component';
import { ResetPasswordComponent } from './views/modules/user/reset-password/reset-password.component';
import {MatMenuModule} from '@angular/material/menu';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatDialogModule} from '@angular/material/dialog';
import { DeleteConfirmDialogComponent } from './shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import { EmptyDataTableComponent } from './shared/views/empty-data-table/empty-data-table.component';
import { LoginTimeOutDialogComponent } from './shared/views/login-time-out-dialog/login-time-out-dialog.component';
import { Nl2brPipe } from './shared/nl2br.pipe';
import { NoPrivilegeComponent } from './shared/views/no-privilege/no-privilege.component';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatRadioModule} from '@angular/material/radio';
import { AdminConfigurationComponent } from './views/admin-configuration/admin-configuration.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { ObjectNotFoundComponent } from './shared/views/object-not-found/object-not-found.component';
import { LoadingComponent } from './shared/views/loading/loading.component';
import { ConfirmDialogComponent } from './shared/views/confirm-dialog/confirm-dialog.component';
import {MatTabsModule} from '@angular/material/tabs';
import { DualListboxComponent } from './shared/ui-components/dual-listbox/dual-listbox.component';
import {FileChooserComponent} from './shared/ui-components/file-chooser/file-chooser.component';
import { ChangePhotoComponent } from './views/modules/user/change-photo/change-photo.component';
import { MyAllNotificationComponent } from './views/modules/user/my-all-notification/my-all-notification.component';
import {ConnectionitemSubFormComponent} from './views/modules/connectiontype/connectiontype-form/connectionitem-sub-form/connectionitem-sub-form.component';
import {DiscountTableComponent} from './views/modules/discount/discount-table/discount-table.component';
import {DiscountFormComponent} from './views/modules/discount/discount-form/discount-form.component';
import {DiscountDetailComponent} from './views/modules/discount/discount-detail/discount-detail.component';
import {DiscountUpdateFormComponent} from './views/modules/discount/discount-update-form/discount-update-form.component';
import {OrderitemSubFormComponent} from './views/modules/iorder/iorder-form/orderitem-sub-form/orderitem-sub-form.component';
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
import {ItemreturnitemSubFormComponent} from './views/modules/itemreturn/itemreturn-form/itemreturnitem-sub-form/itemreturnitem-sub-form.component';
import {VehicleTableComponent} from './views/modules/vehicle/vehicle-table/vehicle-table.component';
import {VehicleFormComponent} from './views/modules/vehicle/vehicle-form/vehicle-form.component';
import {VehicleDetailComponent} from './views/modules/vehicle/vehicle-detail/vehicle-detail.component';
import {VehicleUpdateFormComponent} from './views/modules/vehicle/vehicle-update-form/vehicle-update-form.component';
import {DisposalitemSubFormComponent} from './views/modules/disposal/disposal-form/disposalitem-sub-form/disposalitem-sub-form.component';
import {ConnectionrequestTableComponent} from './views/modules/connectionrequest/connectionrequest-table/connectionrequest-table.component';
import {ConnectionrequestFormComponent} from './views/modules/connectionrequest/connectionrequest-form/connectionrequest-form.component';
import {ConnectionrequestDetailComponent} from './views/modules/connectionrequest/connectionrequest-detail/connectionrequest-detail.component';
import {ConnectionrequestUpdateFormComponent} from './views/modules/connectionrequest/connectionrequest-update-form/connectionrequest-update-form.component';
import {ConnectionrequestitemSubFormComponent} from './views/modules/connectionrequest/connectionrequest-form/connectionrequestitem-sub-form/connectionrequestitem-sub-form.component';
import {ConnectionTableComponent} from './views/modules/connection/connection-table/connection-table.component';
import {ConnectionFormComponent} from './views/modules/connection/connection-form/connection-form.component';
import {ConnectionDetailComponent} from './views/modules/connection/connection-detail/connection-detail.component';
import {ConnectionUpdateFormComponent} from './views/modules/connection/connection-update-form/connection-update-form.component';
import {ConnectionrequestitemUpdateSubFormComponent} from './views/modules/connectionrequest/connectionrequest-update-form/connectionrequestitem-update-sub-form/connectionrequestitem-update-sub-form.component';
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
import {ItemreturnitemUpdateSubFormComponent} from './views/modules/itemreturn/itemreturn-update-form/itemreturnitem-update-sub-form/itemreturnitem-update-sub-form.component';
import {ItemTableComponent} from './views/modules/item/item-table/item-table.component';
import {ItemFormComponent} from './views/modules/item/item-form/item-form.component';
import {ItemDetailComponent} from './views/modules/item/item-detail/item-detail.component';
import {ItemUpdateFormComponent} from './views/modules/item/item-update-form/item-update-form.component';
import {ModificationrequestTableComponent} from './views/modules/modificationrequest/modificationrequest-table/modificationrequest-table.component';
import {ModificationrequestFormComponent} from './views/modules/modificationrequest/modificationrequest-form/modificationrequest-form.component';
import {ModificationrequestDetailComponent} from './views/modules/modificationrequest/modificationrequest-detail/modificationrequest-detail.component';
import {ModificationrequestUpdateFormComponent} from './views/modules/modificationrequest/modificationrequest-update-form/modificationrequest-update-form.component';
import {OrderitemUpdateSubFormComponent} from './views/modules/iorder/iorder-update-form/orderitem-update-sub-form/orderitem-update-sub-form.component';
import {ConnectionitemUpdateSubFormComponent} from './views/modules/connectiontype/connectiontype-update-form/connectionitem-update-sub-form/connectionitem-update-sub-form.component';
import {DisconnectionrequestTableComponent} from './views/modules/disconnectionrequest/disconnectionrequest-table/disconnectionrequest-table.component';
import {DisconnectionrequestFormComponent} from './views/modules/disconnectionrequest/disconnectionrequest-form/disconnectionrequest-form.component';
import {DisconnectionrequestDetailComponent} from './views/modules/disconnectionrequest/disconnectionrequest-detail/disconnectionrequest-detail.component';
import {DisconnectionrequestUpdateFormComponent} from './views/modules/disconnectionrequest/disconnectionrequest-update-form/disconnectionrequest-update-form.component';
import {ItemreciveitemUpdateSubFormComponent} from './views/modules/itemrecive/itemrecive-update-form/itemreciveitem-update-sub-form/itemreciveitem-update-sub-form.component';
import {TaskallocationTableComponent} from './views/modules/taskallocation/taskallocation-table/taskallocation-table.component';
import {TaskallocationFormComponent} from './views/modules/taskallocation/taskallocation-form/taskallocation-form.component';
import {TaskallocationDetailComponent} from './views/modules/taskallocation/taskallocation-detail/taskallocation-detail.component';
import {TaskallocationUpdateFormComponent} from './views/modules/taskallocation/taskallocation-update-form/taskallocation-update-form.component';
import {DisposalitemUpdateSubFormComponent} from './views/modules/disposal/disposal-update-form/disposalitem-update-sub-form/disposalitem-update-sub-form.component';
import {ComplaintTableComponent} from './views/modules/complaint/complaint-table/complaint-table.component';
import {ComplaintFormComponent} from './views/modules/complaint/complaint-form/complaint-form.component';
import {ComplaintDetailComponent} from './views/modules/complaint/complaint-detail/complaint-detail.component';
import {ComplaintUpdateFormComponent} from './views/modules/complaint/complaint-update-form/complaint-update-form.component';
import {TaskallocationitemUpdateSubFormComponent} from './views/modules/taskallocation/taskallocation-update-form/taskallocationitem-update-sub-form/taskallocationitem-update-sub-form.component';
import {IorderTableComponent} from './views/modules/iorder/iorder-table/iorder-table.component';
import {IorderFormComponent} from './views/modules/iorder/iorder-form/iorder-form.component';
import {IorderDetailComponent} from './views/modules/iorder/iorder-detail/iorder-detail.component';
import {IorderUpdateFormComponent} from './views/modules/iorder/iorder-update-form/iorder-update-form.component';
import {ItemreciveitemSubFormComponent} from './views/modules/itemrecive/itemrecive-form/itemreciveitem-sub-form/itemreciveitem-sub-form.component';
import {TaskallocationitemSubFormComponent} from './views/modules/taskallocation/taskallocation-form/taskallocationitem-sub-form/taskallocationitem-sub-form.component';
import { YearWiseConsumerCountComponent } from './views/modules/reports/year-wise-consumer-count/year-wise-consumer-count.component';
import {MatTableExporterModule} from 'mat-table-exporter';
import {ChartsModule} from 'ng2-charts';
import { YearWiseConnectionCountComponent } from './views/modules/reports/year-wise-connection-count/year-wise-connection-count.component';
import { GramaniladharidivWiseConnectionCountComponent } from './views/modules/reports/gramaniladharidiv-wise-connection-count/gramaniladharidiv-wise-connection-count.component';
import {NgxMatSelectSearchModule} from 'ngx-mat-select-search';
import {MatAutocompleteModule} from '@angular/material/autocomplete';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        MainWindowComponent,
        DashboardComponent,
        PageNotFoundComponent,
        PageHeaderComponent,
        NavigationComponent,
        RoleDetailComponent,
        RoleFormComponent,
        RoleTableComponent,
        RoleUpdateFormComponent,
        UserDetailComponent,
        UserFormComponent,
        UserTableComponent,
        UserUpdateFormComponent,
        ChangePasswordComponent,
        ResetPasswordComponent,
        DeleteConfirmDialogComponent,
        EmptyDataTableComponent,
        LoginTimeOutDialogComponent,
        Nl2brPipe,
        NoPrivilegeComponent,
        AdminConfigurationComponent,
        FileChooserComponent,
        ObjectNotFoundComponent,
        LoadingComponent,
        ConfirmDialogComponent,
        DualListboxComponent,
        ChangePhotoComponent,
        MyAllNotificationComponent,
        ConnectionitemSubFormComponent,
        DiscountTableComponent,
        DiscountFormComponent,
        DiscountDetailComponent,
        DiscountUpdateFormComponent,
        OrderitemSubFormComponent,
        EmployeeTableComponent,
        EmployeeFormComponent,
        EmployeeDetailComponent,
        EmployeeUpdateFormComponent,
        ReconnectionrequestTableComponent,
        ReconnectionrequestFormComponent,
        ReconnectionrequestDetailComponent,
        ReconnectionrequestUpdateFormComponent,
        DisposalTableComponent,
        DisposalFormComponent,
        DisposalDetailComponent,
        DisposalUpdateFormComponent,
        ItemreturnTableComponent,
        ItemreturnFormComponent,
        ItemreturnDetailComponent,
        ItemreturnUpdateFormComponent,
        ItemreturnitemSubFormComponent,
        VehicleTableComponent,
        VehicleFormComponent,
        VehicleDetailComponent,
        VehicleUpdateFormComponent,
        DisposalitemSubFormComponent,
        ConnectionrequestTableComponent,
        ConnectionrequestFormComponent,
        ConnectionrequestDetailComponent,
        ConnectionrequestUpdateFormComponent,
        ConnectionrequestitemSubFormComponent,
        ConnectionTableComponent,
        ConnectionFormComponent,
        ConnectionDetailComponent,
        ConnectionUpdateFormComponent,
        ConnectionrequestitemUpdateSubFormComponent,
        ConnectiontypeTableComponent,
        ConnectiontypeFormComponent,
        ConnectiontypeDetailComponent,
        ConnectiontypeUpdateFormComponent,
        ConsumerTableComponent,
        ConsumerFormComponent,
        ConsumerDetailComponent,
        ConsumerUpdateFormComponent,
        ItemreciveTableComponent,
        ItemreciveFormComponent,
        ItemreciveDetailComponent,
        ItemreciveUpdateFormComponent,
        ItemreturnitemUpdateSubFormComponent,
        ItemTableComponent,
        ItemFormComponent,
        ItemDetailComponent,
        ItemUpdateFormComponent,
        ModificationrequestTableComponent,
        ModificationrequestFormComponent,
        ModificationrequestDetailComponent,
        ModificationrequestUpdateFormComponent,
        OrderitemUpdateSubFormComponent,
        ConnectionitemUpdateSubFormComponent,
        DisconnectionrequestTableComponent,
        DisconnectionrequestFormComponent,
        DisconnectionrequestDetailComponent,
        DisconnectionrequestUpdateFormComponent,
        ItemreciveitemUpdateSubFormComponent,
        TaskallocationTableComponent,
        TaskallocationFormComponent,
        TaskallocationDetailComponent,
        TaskallocationUpdateFormComponent,
        DisposalitemUpdateSubFormComponent,
        ComplaintTableComponent,
        ComplaintFormComponent,
        ComplaintDetailComponent,
        ComplaintUpdateFormComponent,
        TaskallocationitemUpdateSubFormComponent,
        IorderTableComponent,
        IorderFormComponent,
        IorderDetailComponent,
        IorderUpdateFormComponent,
        ItemreciveitemSubFormComponent,
        TaskallocationitemSubFormComponent,
        YearWiseConsumerCountComponent,
        YearWiseConnectionCountComponent,
        GramaniladharidivWiseConnectionCountComponent,

    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        NgbModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatCardModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        MatIconModule,
        MatToolbarModule,
        MatCardModule,
        HttpClientModule,
        MatSidenavModule,
        MatBadgeModule,
        MatTooltipModule,
        MatListModule,
        MatExpansionModule,
        MatGridListModule,
        MatTreeModule,
        MatSlideToggleModule,
        MatMenuModule,
        MatSnackBarModule,
        MatDialogModule,
        MatTableModule,
        MatPaginatorModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatRadioModule,
        MatProgressSpinnerModule,
        MatTabsModule,
        MatTableExporterModule,
        ChartsModule,
        NgxMatSelectSearchModule,
        MatAutocompleteModule,
    ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: Interceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
