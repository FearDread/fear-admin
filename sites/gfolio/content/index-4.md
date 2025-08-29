---
layout: Home-4
seo:
  title: Web Developer
  description: Custom description for this page goes here
---

---main
slogan: Face Everything and Rise
---

# *Garrett Haptonstall*

## <Typewriter>Full-Stack Developer</Typewriter>

##### <span>Based in Central TX</span>
 
<Sep size={6} line className='max-w-sm mx-auto' />
My technology journey encompasses both open-source and private enterprise environments, with hands-on experience in technical support, systems administration, development, network engineering, and project management. I'm a versatile IT professional who loves the continuous evolution of technology and the opportunity to grow with it.

  ```js  {4-7} showLineNumbers
  import FEAR from './FEAR.js';

  (async () => {

    async function start() {
    
        FEAR.db.run( FEAR.env, () => {
            FEAR.app.listen( port, (err) => {
                if ( err ) return;
                FEAR.log.info(`FEAR API Initialized :: Port ${port}`);
            });
        });
    }

    await start();

  })( FEAR );
  ```

---companies
title: Trusted By
list:
  - name: Company 1
    icon:
      src: /icons/logo-1.svg
  - name: Company 2
    icon:
      src: /icons/logo-3.svg
  - name: Company 3
    icon:
      src: /icons/logo-3.svg
  - name: Company 4
    icon:
      src: /icons/logo-4.svg
---

---articles
collection:
  path: /blog
  recordsPerPage: 6
  limit: 6
  sortBy: date
  filterBy:
    featured:
      $eq: true
---

<Newsletter className="bg-omega-800 p-10" />

#### <span>Featured Articles</span>

Featured handcrafted articles about my thoughts and experiments.

---achievements
- number: 6+
  text: Years of experience
- number: 60+
  text: Projects Completed
- number: 12
  text: OpenSource Libraries
- number: 50+
  text: Happy Customers
---

---cta
---

<a href="Ghaptonstall_Resume.pdf" size="sm" download="cv" className="button"> Download Resume </a>
<TipJar />