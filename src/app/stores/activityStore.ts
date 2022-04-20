import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Activity } from "../Models/activity";
import {v4 as uuid} from 'uuid';

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
    loadActivities = async () => {
        this.SetloadingInitial(true); 
        try{ 
           const activities = await agent.Activities.list();
            activities.forEach( activity => {
            activity.date = activity.date.split('T')[0];
            this.ActivityRegistery.set(activity.id , activity);
            })
            this.SetloadingInitial(false); 
        }
        catch(error){
            console.log(error);
            this.SetloadingInitial(false); 

        }
    }
    SetloadingInitial = (state : boolean) =>{
        this.Loadingintial = state;
    }
    handleSelectActivity = ( Id : string) => {
        this.selectedActivity = this.ActivityRegistery.get(Id);
    }
    cancelSelectActivity = () => {
        this.selectedActivity = undefined;
    }
    openForm = (id? : string) => {
        id ? this.handleSelectActivity(id) : this.cancelSelectActivity();
        this.editeMode= true;
    }
    closeForm = () => {
        this.editeMode = false;
    }
    
    createActivity = async (activity : Activity) => {
        this.loading=true;
        activity.id = uuid();
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
                if (this.selectedActivity?.id === id ) this.cancelSelectActivity();
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