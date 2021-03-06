uniform vec3 iResolution; 
uniform float iGlobalTime; 
uniform vec4 iLoc; 
uniform float iChannelTime[4]; 
uniform vec3 iChannelResolution[4]; 
uniform sampler2D iChannel0; 
uniform vec3 iMouse; 
uniform vec4 iDate; 
//https://www.shadertoy.com/view/4ds3zX
float bouncy(vec2 v)
{	
	vec2  cp = v * iGlobalTime;
	vec2 cp_wrap = vec2(ivec2(cp) / ivec2(iResolution.xy));	
	cp = mod(cp, iResolution.xy);
	cp = mix(cp, iResolution.xy - cp, mod(cp_wrap, 2.0));		
	return 25.0 / (1.0+length(cp - gl_FragCoord.xy));
}

void main(void)
{						
	vec3 res = vec3(0);	
	res += vec3(1.0, 0.3, 0.2) * bouncy(vec2(211, 312));
	res += vec3(0.3, 1.0, 0.2) * bouncy(vec2(312, 210));
	res += vec3(0.2, 0.3, 1.0) * bouncy(vec2(331, 130));
	gl_FragColor = vec4(res, 1);	
}
