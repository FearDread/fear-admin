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

Gfolio will show you my resume with details on the mentioned skill sets and work history. I really look forward to receiving your input, and possibly scheduling a meeting to discuss this position further. Please feel free to contact me directly by phone or email, and again thank you for your time and consideration.

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
- number: 10+
  text: Years of experience
- number: 30+
  text: Personal Repositories
- number: 5
  text: OpenSource Libraries
- number: 50+
  text: Happy Customers
---

---cta
---

<Button href="Ghaptonstall_Resume.pdf" size="sm" download="ghap_resume">
  Download Resume
</Button>
<TipJar />