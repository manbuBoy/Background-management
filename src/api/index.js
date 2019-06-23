
import ajaxt from './ajaxt';

export const reqLogin = (username,password) => ajaxt('/login',{username,password},'POST')