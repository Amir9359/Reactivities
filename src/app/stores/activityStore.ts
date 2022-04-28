import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Activity } from "../Models/activity";

export default class activityStore {
    ActivityRegistery = new Map<string , Activity>();
    selectedActivity : Activity | undefined = undefined;
    editeMode = false ; 
    loading = false;
    Loadingintial = false ;

    constructor () {
        makeAutoObservable(this)
    }
     get activitiesByDate() {
         return Array.from(this.ActivityRegistery.values()).sort((a, b) => 
         Date.parse(a.date) - Date.parse(b.date));
     }
     get groupedActivities() {
         return Object.entries(
             this.activitiesByDate.reduce((activities , activity) => {
                 const date = activity.date;
                 activities[date] = activities[date] ?[...activities[date], activity] : [activity];
                 return activities; 
             }, {} as {[Key: string] : Activity[]})
         )
     }

    loadActivities = async () => {
        this.Loadingintial= true; 
        try{ 
           const activities = await agent.Activities.list();
            activities.forEach( activity => {
                this.setActivity(activity);
            })
            this.SetloadingInitial(false); 
        }
        catch(error){
            console.log(error);
            this.SetloadingInitial(false); 
        }
    }

    loadActivity = async (id : string) => {
        let activity = this.getActivity(id);
        if(activity){
            this.selectedActivity = activity;
            return activity;
        } else {
            this.Loadingintial= true;
            try {
                activity= await agent.Activities.detail(id);
                this.setActivity(activity);
                runInAction(() => {
                    this.selectedActivity = activity
                });
                this.SetloadingInitial(false);
                return activity;
            }
            catch(error)
            {
                console.log(error);
                this.SetloadingInitial(false);
            }
            
        }
    }
    private setActivity = (activity : Activity ) => {
        activity.date = activity.date.split('T')[0];
        this.ActivityRegistery.set(activity.id , activity);
    }
    private getActivity  = (id : string) =>{
      return   this.ActivityRegistery.get(id);
    }
    SetloadingInitial = (state : boolean) =>{
        this.Loadingintial = state;
    }
    
    
    createActivity = async (activity : Activity) => {
        this.loading=true;
        try{
            await agent.Activities.create(activity);
            runInAction(() => {
                this.ActivityRegistery.set(activity.id , activity);
                this.selectedActivity= activity;
                this.editeMode= false; 
                this.loading=false;
            })
      

        }catch(error)
        {
            console.log(error)
            runInAction(() => { 
                this.loading=false;
            } )
        }
        
    }

    UpdateActivity = async (activity : Activity) =>{
        this.loading = true ; 
        try{
            await agent.Activities.update(activity);
            runInAction(() => {
                this.ActivityRegistery.set(activity.id , activity)

                this.selectedActivity= activity;
                this.editeMode= false ; 
                this.loading= false;
            })
        }catch(error) 
        {
            console.log(error)
            runInAction(() => { 
                this.loading=false;
            } )
        }
    }
    
    deleteActivty = async (id : string) => {
        this.loading= true;
        try{
            await agent.Activities.delete(id);
            runInAction(() => {
                this.ActivityRegistery.delete(id);
                this.loading= false;
            })

        }catch(error)
        {
            console.log(error)
            runInAction(() => { 
                this.loading=false;
            } )
        }
    }
 
}