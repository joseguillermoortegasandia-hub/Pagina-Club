import { NextResponse } from 'next/server';
import { getApiActor } from '@/lib/api-auth';
import { createClient } from '@/lib/supabase/server';
import { slugify } from '@/lib/format';
export async function POST(request:Request){const auth=await getApiActor('club');if('error'in auth)return NextResponse.json({error:auth.error},{status:auth.status});const body=await request.json();if(!body.name)return NextResponse.json({error:'El nombre es obligatorio.'},{status:400});const supabase=await createClient();const {data,error}=await supabase.from('sports').insert({name:String(body.name).trim(),slug:slugify(String(body.slug||body.name)),icon:body.icon||'🏆',description:body.description||null,image_url:body.image_url||null,sort_order:Number(body.sort_order||0)}).select().single();if(error)return NextResponse.json({error:error.message},{status:400});return NextResponse.json({ok:true,sport:data});}
