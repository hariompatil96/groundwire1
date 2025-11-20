export const auth_roles_enum = {
    admin: 'admin'
}

export const API_ROUTES = {
    signIn: "api/admin/login",
    getMe: "api/admin/me",
    editProfilePicture: "api/image/user-picture/create",
    changePassword: "api/admin/change-password",

    // Form builder api routes
    getForms: "api/form/list",
    getFormByID: "api/form/by-Id",
    createForm: "api/form/save",
    updateForm: "api/form/update",
    deleteForm: "api/form/delete",

    // Form submissions api route
    submitForm: "api/form/value/save",
    getFormSubmissions: "api/form/value/get-form-list",
    deleteFormSubmission: "api/form/value/delete",
    updateFormSubmission: "api/form/value/update",
    fetchFormSubmission: "api/form/value/find", 

    //Analytic api's

    getAnalytics: "api/analytic/list",
    getAnalyticByID: "api/analytic/by-id",
    createAnalytic: "api/analytic/create",
    updateAnalytic: "api/analytic/update",
    deleteAnalytic: "api/analytic/delete",

    // Dashboard Api's

    getPlatformList: "getPlatformlist",
    getCampaign: "getCampaign",
    getCampaignList: "getCampaignlist",
    getLiveData: "getLiveStatics",
    
    // sheet api's
    getPlatformListSheet: "getPlatformlistsheet",
    getCampaignSheet: "getCampaignsheet",
    getCampaignListSheet: "getCampaignlistsheet",

    // analytic api's
    getGwSites: "gwSitesData",
    getReports: "gwSitesDataWithID",
    getPofData: "embedMapData",
    storeLatLong: "storeLatLong"
}