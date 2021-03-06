uniform vec3 iResolution; 
uniform float iGlobalTime; 
uniform vec4 iLoc; 
uniform float iChannelTime[4]; 
uniform vec3 iChannelResolution[4]; 
uniform sampler2D iChannel0; 
uniform vec3 iMouse; 
uniform vec4 iDate; 
//https://www.shadertoy.com/view/XdXGzB
#define pos 6.
#define res 70.
#define spe 20.
void main(void)
{
	vec2 uv = gl_FragCoord.xy / iResolution.xy-.5;
	uv.x*=iResolution.x/iResolution.y;
	uv+=.5/res;
	float d=pow(10.,pos);
	vec2 g=uv*res;
	vec2 p=floor(g)/res*(1.+iGlobalTime/d*spe);
	vec2 f=fract(g)-.5;
	float l=length(p);
	float c=abs(floor(l*d)-floor(l*d/10.)*10.)*.1;
	c*=1.25-length(f)*1.5;
	gl_FragColor = vec4(c*c,c,c*c*c,1.)*(1.5-dot(uv,uv));
}