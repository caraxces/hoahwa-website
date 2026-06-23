/** Runs before paint to avoid vibe flash. Keep in sync with vibe.ts */
export const vibeInitScript = `(function(){try{var v=localStorage.getItem("hoahwa-vibe");var m={happy:"windy",rainy:"raining"};var n=m[v]||v;document.documentElement.setAttribute("data-vibe",n==="sunny"||n==="windy"||n==="raining"?n:"windy");}catch(e){document.documentElement.setAttribute("data-vibe","windy");}})();`;
