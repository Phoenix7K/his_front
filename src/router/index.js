import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld';
import login_banner from '@/components/login_banner';
import login_welcome from '@/components/login_welcome';
import dept from "@/components/management/dept";
import user from "@/components/management/user";
import constant from "@/components/management/constant";
import disease from "@/components/management/disease";
import non_medic from "@/components/management/non_medic";
import shift from "@/components/management/shift";
import homepage from "@/components/outpatient/homepage";
import templates from "@/components/outpatient/templates";
import frontpage from "@/components/outpatient/homepageSub/frontpage";
import examination from "@/components/outpatient/homepageSub/examination";
import inspection from "@/components/outpatient/homepageSub/inspection";
import treatment from "@/components/outpatient/homepageSub/treatment";
import diagconfirm from "@/components/outpatient/homepageSub/diagconfirm";
import patentmed from "@/components/outpatient/homepageSub/patentmed";
import herbal from "@/components/outpatient/homepageSub/herbal";
import billquery from "@/components/outpatient/homepageSub/billquery";
import bill from "@/components/register/bill";
import receipt from "@/components/register/receipt";
import register from "@/components/register/register";
import cancel_register from "@/components/register/cancel_register";
import receipt_preview from "@/components/register/receipt_preview";
import dailyrecord from "@/components/financial/dailyrecord";
import exam from "@/components/medtech/exam";
import medtech from "@/components/medtech/medtech";
import depts from "@/components/financial/depts";
import doctors from "@/components/financial/doctors";
import medicine from "@/components/pharmacy/medicine";
import send from "@/components/pharmacy/send";
import returnM from "@/components/pharmacy/returnM";

Vue.use(Router)

export default new Router({
  mode: 'hash',
  routes: [
    {
      path: '/',
      name: 'login_banner',
      component: login_banner
    },
    {
      path: '/login_banner',
      name: 'login_banner',
      component: login_banner
    },
    {
      path: '/login_welcome',
      name: 'login_welcome',
      component: login_welcome
    },
    {
      path: '/dept',
      name: 'Department',
      component: dept
    },
    {
      path: '/user',
      name: 'Users',
      component: user
    },
    {
      path: '/constant',
      name: 'Constant',
      component: constant
    },
    {
      path: '/disease',
      name: 'Disease',
      component: disease
    },
    {
      path: '/non_medic',
      name: 'Non-medical Charge',
      component: non_medic
    },
    {
      path: '/shift',
      name: 'Shift',
      component: shift
    },{
      path: '/templates',
      name: 'Templates',
      component: templates
    },
    {
      path: '/homepage',
      name: 'HomePage',
      component: homepage,
      children:[{
        path: '/frontpage',
        component: frontpage,
      },{
        path: '/examination',
        component: examination,
      },{
        path: '/inspection',
        component: inspection,
      },{
        path: '/treatment',
        component: treatment,
      },{
        path: '/diagconfirm',
        component: diagconfirm,
      },{
        path: '/patentmed',
        component: patentmed,
      },{
        path: '/herbal',
        component: herbal,
      },{
        path: '/billquery',
        component: billquery,
      }]
    },
    {
      path: '/bill',
      name: 'Bill',
      component: bill
    },
    {
      path: '/receipt',
      name: 'Receipt',
      component: receipt
    },
    {
      path: '/register',
      name: 'register',
      component: register
    },
    {
      path: '/cancel_register',
      name: 'cancel_register',
      component: cancel_register
    },
    {
      path: '/receipt_preview/:recid',
      name: 'receipt_preview',
      component: receipt_preview
    },
    {
      path: '/dailyrecord',
      name: 'dailyrecord',
      component: dailyrecord
    },
    {
      path: '/exam',
      name: 'exam',
      component: exam
    },
    {
      path: '/medtech',
      name: 'medtech',
      component: medtech
    },
    {
      path: '/medicine',
      name: 'medicine',
      component: medicine
    },
    {
      path: '/send',
      name: 'send',
      component: send
    },
    {
      path: '/returnM',
      name: 'returnM',
      component: returnM
    },
    {
      path: '/depts',
      name: 'depts',
      component: depts
    },
    {
      path: '/doctors',
      name: 'doctors',
      component: doctors
    }
  ]
})
