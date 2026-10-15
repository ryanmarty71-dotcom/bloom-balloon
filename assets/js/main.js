const themeToggle = document.querySelector('.theme-toggle');
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    let savedTheme = null;
    try {
      savedTheme = localStorage.getItem('blooms-theme');
    } catch (error) {
      savedTheme = null;
    }
    const setTheme = (theme) => {
      document.documentElement.dataset.theme = theme;
      themeColorMeta.content = theme === 'dark' ? '#171416' : '#fff1f3';
      const nextTheme = theme === 'dark' ? 'light' : 'dark';
      themeToggle.setAttribute('aria-label', `Switch to ${nextTheme} mode`);
      themeToggle.setAttribute('title', `Switch to ${nextTheme} mode`);
      themeToggle.innerHTML = `<span aria-hidden="true">${theme === 'dark' ? '☀' : '☾'}</span>`;
    };
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(savedTheme === 'dark' || (savedTheme === null && systemPrefersDark) ? 'dark' : 'light');
    themeToggle.addEventListener('click', () => {
      const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      setTheme(nextTheme);
      try {
        localStorage.setItem('blooms-theme', nextTheme);
      } catch (error) {
        themeToggle.title = `Switch to ${nextTheme === 'dark' ? 'dark' : 'light'} mode (preference won't persist in this browser)`;
      }
    });
    const cursorGlow = document.querySelector('.cursor-glow');
    const cursorMotion = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    if (cursorMotion.matches) {
      let pointerFrame = 0;
      document.addEventListener('pointermove', (event) => {
        if (pointerFrame) return;
        pointerFrame = window.requestAnimationFrame(() => {
          cursorGlow.style.left = `${event.clientX}px`;
          cursorGlow.style.top = `${event.clientY}px`;
          cursorGlow.classList.add('is-visible');
          pointerFrame = 0;
        });
      });
      document.addEventListener('pointerover', (event) => {
        cursorGlow.classList.toggle('is-hovering', Boolean(event.target.closest('a, button, input, select, textarea')));
      });
      document.addEventListener('pointerleave', () => cursorGlow.classList.remove('is-visible'));
    }
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    menuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
    });
    navLinks.addEventListener('click', (event) => {
      if (event.target.closest('a')) {
        navLinks.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Open navigation');
      }
    });
    document.querySelector('#year').textContent = new Date().getFullYear();
    const calendarMonth = document.querySelector('#calendar-month');
    const calendarDays = document.querySelector('#calendar-days');
    const calendarSelection = document.querySelector('#calendar-selection');
    const dateInput = document.querySelector('#date');
    const timeField = document.querySelector('#time-field');
    const timeInput = document.querySelector('#time');
    const inspirationInput = document.querySelector('#inspiration-video');
    const inspirationStatus = document.querySelector('#video-status');
    const previousMonthButton = document.querySelector('#calendar-prev');
    const nextMonthButton = document.querySelector('#calendar-next');
    const today = new Date();
    const todayKey = [today.getFullYear(), String(today.getMonth() + 1).padStart(2, '0'), String(today.getDate()).padStart(2, '0')].join('-');
    let visibleMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const dateKey = (date) => [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
    const renderCalendar = () => {
      calendarMonth.textContent = visibleMonth.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
      calendarDays.replaceChildren();
      const firstWeekday = visibleMonth.getDay();
      const daysInMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 0).getDate();
      for (let blank = 0; blank < firstWeekday; blank += 1) {
        const spacer = document.createElement('span');
        spacer.className = 'calendar-empty';
        spacer.setAttribute('aria-hidden', 'true');
        calendarDays.append(spacer);
      }
      for (let day = 1; day <= daysInMonth; day += 1) {
        const date = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), day);
        const key = dateKey(date);
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'calendar-day';
        button.textContent = String(day);
        button.dataset.date = key;
        button.setAttribute('aria-label', date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }));
        button.setAttribute('aria-pressed', String(key === dateInput.value));
        button.disabled = key < todayKey;
        if (key === todayKey) button.classList.add('is-today');
        if (key === dateInput.value) button.classList.add('is-selected');
        calendarDays.append(button);
      }
      const firstOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      previousMonthButton.disabled = visibleMonth <= firstOfCurrentMonth;
    };
    calendarDays.addEventListener('click', (event) => {
      const dayButton = event.target.closest('button[data-date]');
      if (!dayButton || dayButton.disabled) return;
      dateInput.value = dayButton.dataset.date;
      calendarSelection.textContent = `Preferred date: ${new Date(`${dateInput.value}T12:00:00`).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}`;
      timeField.hidden = false;
      timeInput.disabled = false;
      renderCalendar();
      timeInput.focus();
    });
    previousMonthButton.addEventListener('click', () => {
      visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1);
      renderCalendar();
    });
    nextMonthButton.addEventListener('click', () => {
      visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1);
      renderCalendar();
    });
    if (inspirationInput && inspirationStatus) {
      inspirationInput.addEventListener('change', () => {
        const selectedVideo = inspirationInput.files && inspirationInput.files[0];
        inspirationStatus.textContent = selectedVideo ? `Inspiration video selected: ${selectedVideo.name}` : 'No inspiration video selected.';
      });
    }
    renderCalendar();
    document.querySelector('.contact-form').addEventListener('submit', (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      if (!dateInput.value) {
        calendarSelection.textContent = 'Please select your preferred celebration date.';
        calendarDays.querySelector('button:not(:disabled)')?.focus();
        return;
      }
      const values = new FormData(form);
      const selectedVideo = inspirationInput && inspirationInput.files && inspirationInput.files[0];
      const message = [
        'Hello Blooms Balloon! I would like to enquire about a room decoration.',
        `Name: ${values.get('name')}`,
        `Email: ${values.get('email')}`,
        `Preferred date: ${values.get('date')}`,
        `Preferred setup time: ${values.get('time') || 'Flexible'}`,
        `Package: ${values.get('occasion') || 'Not selected'}`,
        `Inspiration video: ${selectedVideo ? `${selectedVideo.name} (${(selectedVideo.size / (1024 * 1024)).toFixed(2)} MB)` : 'No video attached'}`,
        `Details: ${values.get('details') || 'None'}`
      ].join('\n');
      window.location.href = `https://wa.me/254750159415?text=${encodeURIComponent(message)}`;
    });

    const reviewForm = document.querySelector('#review-form');
    const reviewList = document.querySelector('#review-list');
    const reviewStatus = document.querySelector('#review-status');
    const reviewConfig = window.BLOOMS_REVIEWS_CONFIG;
    const reviewsUrl = reviewConfig && reviewConfig.url;
    const reviewsKey = reviewConfig && reviewConfig.anonKey;
    const reviewsReady = Boolean(reviewsUrl && reviewsKey);
    const setReviewStatus = (message, isError = false) => {
      reviewStatus.textContent = message;
      reviewStatus.classList.toggle('is-error', isError);
    };
    const renderReviews = (reviews) => {
      reviewList.replaceChildren();
      if (!reviews.length) {
        const emptyMessage = document.createElement('p');
        emptyMessage.className = 'review-empty-message';
        emptyMessage.textContent = 'No reviews yet. Be the first to share your experience.';
        reviewList.append(emptyMessage);
        return;
      }
      reviews.forEach((review) => {
        const card = document.createElement('article');
        card.className = 'review-card';
        const header = document.createElement('div');
        header.className = 'review-card-header';
        const author = document.createElement('div');
        const name = document.createElement('h3');
        name.textContent = review.name;
        const stars = document.createElement('p');
        stars.className = 'review-stars';
        stars.setAttribute('aria-label', `${review.rating} out of 5 stars`);
        stars.textContent = `${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}`;
        author.append(name, stars);
        const date = document.createElement('time');
        const createdAt = new Date(review.created_at);
        date.dateTime = createdAt.toISOString();
        date.textContent = createdAt.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
        header.append(author, date);
        const message = document.createElement('p');
        message.textContent = review.review;
        card.append(header, message);
        reviewList.append(card);
      });
    };
    const fetchReviews = async () => {
      if (!reviewsReady) {
        reviewList.replaceChildren();
        const setupMessage = document.createElement('p');
        setupMessage.className = 'review-empty-message';
        setupMessage.textContent = 'Reviews are temporarily unavailable. Please check back soon.';
        reviewList.append(setupMessage);
        reviewList.setAttribute('aria-busy', 'false');
        return;
      }
      try {
        const response = await fetch(`${reviewsUrl.replace(/\/$/, '')}/rest/v1/reviews?select=id,name,rating,review,created_at&order=created_at.desc&limit=100`, {
          headers: { apikey: reviewsKey, Authorization: `Bearer ${reviewsKey}` }
        });
        if (!response.ok) throw new Error(`Reviews could not be loaded (${response.status}).`);
        renderReviews(await response.json());
      } catch (error) {
        reviewList.replaceChildren();
        const errorMessage = document.createElement('p');
        errorMessage.className = 'review-empty-message';
        errorMessage.textContent = 'We couldn’t load reviews right now. Please try again later.';
        reviewList.append(errorMessage);
        console.error('Unable to load customer reviews.', error);
      } finally {
        reviewList.setAttribute('aria-busy', 'false');
      }
    };
    reviewForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!reviewsReady) {
        setReviewStatus('Reviews are not connected yet. Please try again later.', true);
        return;
      }
      if (reviewForm.elements.website.value) return;
      const submitButton = reviewForm.querySelector('button[type="submit"]');
      submitButton.disabled = true;
      setReviewStatus('Posting your review…');
      try {
        const response = await fetch(`${reviewsUrl.replace(/\/$/, '')}/rest/v1/reviews`, {
          method: 'POST',
          headers: {
            apikey: reviewsKey,
            Authorization: `Bearer ${reviewsKey}`,
            'Content-Type': 'application/json',
            Prefer: 'return=representation'
          },
          body: JSON.stringify({
            name: reviewForm.elements.name.value.trim(),
            rating: Number(reviewForm.elements.rating.value),
            review: reviewForm.elements.review.value.trim()
          })
        });
        if (!response.ok) throw new Error(`Review could not be posted (${response.status}).`);
        reviewForm.reset();
        setReviewStatus('Thank you! Your review is now live.');
        await fetchReviews();
      } catch (error) {
        setReviewStatus('We couldn’t post your review. Please try again in a moment.', true);
        console.error('Unable to post customer review.', error);
      } finally {
        submitButton.disabled = false;
      }
    });
    fetchReviews();

    const tiktokSection = document.querySelector('#tiktok');
    const loadTikTokEmbed = () => {
      if (document.querySelector('script[data-tiktok-embed]')) return;
      const script = document.createElement('script');
      script.src = 'https://www.tiktok.com/embed.js';
      script.async = true;
      script.dataset.tiktokEmbed = 'true';
      document.body.append(script);
    };
    if ('IntersectionObserver' in window) {
      const tiktokObserver = new IntersectionObserver((entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        loadTikTokEmbed();
        tiktokObserver.disconnect();
      }, { rootMargin: '300px 0px' });
      tiktokObserver.observe(tiktokSection);
    } else {
      loadTikTokEmbed();
    }
