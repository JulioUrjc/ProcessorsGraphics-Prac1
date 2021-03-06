uniform vec3 iResolution; 
uniform float iGlobalTime; 
uniform vec4 iLoc; 
uniform float iChannelTime[4]; 
uniform vec3 iChannelResolution[4]; 
uniform sampler2D iChannel0; 
uniform vec3 iMouse; 
uniform vec4 iDate; 
//https://www.shadertoy.com/view/ldf3zM
//lighter version of Dancing Microorganism by kali
//#define DOF_EFFECT
//uncomment to enable DOF (actually works faster!)

mat3 rot(vec3 v, float angle)
{
	float c = cos(angle);
	float s = sin(angle);
	
	return mat3(c + (1.0 - c) * v.x * v.x, (1.0 - c) * v.x * v.y - s * v.z, (1.0 - c) * v.x * v.z + s * v.y,
		(1.0 - c) * v.x * v.y + s * v.z, c + (1.0 - c) * v.y * v.y, (1.0 - c) * v.y * v.z - s * v.x,
		(1.0 - c) * v.x * v.z - s * v.y, (1.0 - c) * v.y * v.z + s * v.x, c + (1.0 - c) * v.z * v.z
		);
}

vec2 f=vec2(0.5,2.);

float surfkifs(vec3 p,float sca) {
	float time = iGlobalTime*1.2;
	vec2 c=vec2(1.,1.);
	const int iter=12;
	float sc=1.16+sca*.025;
	vec3 j=vec3(-1,-1,-1.5);
	//vec3 rotv=normalize(vec3(0.2,-0.2,-1)+.2*vec3(sin(time),-sin(time),cos(time)));
	vec3 rotv=normalize(vec3(-0.08+sin(time)*.02,-0.2,-.5));
	float rota=radians(50.);
	mat3 rotm=rot(normalize(rotv),rota);
	p.z=abs(p.z)-4.;
	for (int i=0; i<iter; i++) {
		p.xy=abs(p.xy+f.xy)-f.xy;
		p*=rotm;
		p*=sc;
		p+=j;
		
	}
	return length(p)*pow(sc,float(-iter));
}

void main(void)
{
	float sca=.9;
	float time = iGlobalTime*.4;
	vec2 coord = gl_FragCoord.xy / iResolution.xy *2. - vec2(1.);
	coord.y *= iResolution.y / iResolution.x;
	float dist=29.+sin(time*2.)*5.;
	vec3 target = vec3(-f,0);
	vec3 from = target+dist*normalize(vec3(sin(time),cos(time),.5+sin(time)));
	vec3 up=vec3(1,sin(time)*.5,1);
    vec3 edir = normalize(target - from);
    vec3 udir = normalize(up-dot(edir,up)*edir);
    vec3 rdir = normalize(cross(edir,udir));
	float fov=0.6+sca*.04;
	vec3 dir=normalize((coord.x*rdir+coord.y*udir)*fov+edir);
	vec3 p=from;
	float steps;
	float totdist;
	float intens=1.;
	float maxdist=dist+15.;
	vec3 col=vec3(0.);
	for (int r=0; r<30; r++) {
		float d1=surfkifs(p,sca);
		float d2=7.;
		float d=min(d1,d2);
		#ifdef DOF_EFFECT
			totdist+=max(max(0.5-time*0.5,0.02*pow(totdist*.06,3.)),abs(d));
		#else
			totdist+=max(max(0.5-time*0.5,0.03),abs(d));
		#endif
		if (totdist>maxdist) break;
		p=from+totdist*dir;
		steps++;
		intens=max(0.,maxdist-totdist+3.)/maxdist;
		col+=(d==d1?vec3(.3,1,.2)*pow(intens,2.5):vec3(.7,1,.1)*(.05+sca*.2)*intens);
	}
	col=col*0.075+vec3(.5)*(max(0.,length(coord)-.6));
	gl_FragColor = vec4(col,1.0);	
	
}