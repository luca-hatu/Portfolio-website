document.addEventListener('DOMContentLoaded', () => {
    fetchGitHubRepos();
    AOS.init();
    gsap.registerPlugin(ScrollTrigger);
    gsap.from('.project', {
        y: 100, 
        opacity: 0, 
        duration: 1, 
        stagger: 0.1, 
        ease: 'power2.out', 
        scrollTrigger: {
            trigger: '.project',
            start: 'top bottom', 
            end: 'bottom top', 
            scrub: true, 
        }
    });
    fetchRecentTracks();
});
    AOS.init();

    gsap.registerPlugin(ScrollTrigger);

    gsap.from('.project', {
        y: 100, 
        opacity: 0, 
        duration: 1, 
        stagger: 0.1, 
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.project',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
        }
    });


async function fetchGitHubRepos() {
    const response = await fetch('https://api.github.com/users/luca-hatu/repos');
    const repos = await response.json();
    renderProjects(repos);
}

function renderProjects(repos) {
    const projectGrid = document.querySelector('#projects');
    const excludedRepos = ['luca-hatu', 'luca-hatu.github.io'];

    repos
        .filter(repo => !excludedRepos.includes(repo.name))
        .forEach(repo => {
            const projectElement = document.createElement('div');
            projectElement.classList.add('project');
            projectElement.innerHTML = `
                <h3>${repo.name}</h3>
                <p>${repo.description}</p>
                <div class="project-links">
                    <button onclick="window.open('${repo.html_url}', '_blank')">
                        <i class="fab fa-github"></i> View Repository
                    </button>
                    ${repo.homepage ? 
                        `<button onclick="window.open('${repo.homepage}', '_blank')">
                            <i class="fas fa-external-link-alt"></i> View Live
                        </button>` : ''}
                </div>
            `;
            projectGrid.appendChild(projectElement);
        });
}

document.addEventListener('DOMContentLoaded', () => {
    fetchLastFmData();
});

async function fetchLastFmData() {
    const API_KEY = '751e9447bf711e75d04ccb4d014c981c'; 
    const USERNAME = 'luca_htu'; 
    const URL = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${USERNAME}&api_key=${API_KEY}&format=json`;

    try {
        const response = await fetch(URL);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        
        console.log('Last.fm API response:', data);

        const recentTracks = data.recenttracks.track;
        const trackList = document.getElementById('recent-tracks');
        trackList.innerHTML = ''; 

        if (recentTracks && recentTracks.length > 0) {
            const tracksToShow = recentTracks.slice(0, 3);
            
            tracksToShow.forEach(track => {
                const trackElement = document.createElement('div');
                trackElement.className = 'track';
                trackElement.innerHTML = `
                    <div class="track-info">
                        ${track.image ? `<img src="${track.image[2]['#text']}" alt="${track.name} Album Art" class="track-image">` : ''}
                        <p><strong>${track.artist['#text']}</strong> - ${track.name}</p>
                    </div>
                `;
                trackList.appendChild(trackElement);
            });
        } else {
            trackList.innerHTML = 'No recent tracks available.';
        }
    } catch (error) {
        console.error('Error fetching Last.fm data:', error);
        document.getElementById('recent-tracks').innerHTML = 'Error fetching data.';
    }
}
async function fetchTopArtists() {
    const API_KEY = '751e9447bf711e75d04ccb4d014c981c';
    const USERNAME = 'luca_htu';
    const URL = `https://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=${USERNAME}&api_key=${API_KEY}&format=json`;

    try {
        const response = await fetch(URL);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        const topArtists = data.topartists.artist;
        const artistList = document.getElementById('top-artists');
        artistList.innerHTML = ''; 

        if (topArtists && topArtists.length > 0) {
            topArtists.forEach(artist => {
                const artistElement = document.createElement('div');
                artistElement.className = 'artist';
                artistElement.innerHTML = `
                    <div class="artist-info">
                        ${artist.image ? `<img src="${artist.image[2]['#text']}" alt="${artist.name} Image" class="artist-image">` : ''}
                        <p><strong>${artist.name}</strong></p>
                    </div>
                `;
                artistList.appendChild(artistElement);
            });
        } else {
            artistList.innerHTML = 'No top artists available.';
        }
    } catch (error) {
        console.error('Error fetching Top Artists data:', error);
        document.getElementById('top-artists').innerHTML = 'Error fetching data.';
    }
}
const username = 'luca-hatu';
const activityList = document.getElementById('activity-content');

async function fetchActivity() {
    const response = await fetch(`https://api.github.com/users/${username}/events`);
    const events = await response.json();
    displayActivity(events.slice(0, 2)); 
}

function displayActivity(events) {
    activityList.innerHTML = '';

    events.forEach(event => {
        const eventType = event.type.replace(/([A-Z])/g, ' $1').trim();
        const repoName = event.repo.name;
        const eventTime = new Date(event.created_at).toLocaleString();

        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        activityItem.innerHTML = `
            <strong>${eventType}</strong> at 
            <a href="https://github.com/${repoName}" target="_blank">${repoName}</a>
            <p>${eventTime}</p>
        `;
        activityList.appendChild(activityItem);
    });
}

fetchActivity();
