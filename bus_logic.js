
document.addEventListener('DOMContentLoaded', () => {
    const bus = document.querySelector('.danfo-bus');
    const container = document.querySelector('.bus-animation-container');

    // Tools list with colors
    const tools = [
        { icon: 'fa-aws', color: '#ff9900' },
        { icon: 'fa-docker', color: '#0db7ed' },
        { icon: 'fa-python', color: '#3776ab' },
        { icon: 'fa-dharmachakra', color: '#326ce5' }, // Kubernetes
        { icon: 'fa-git-alt', color: '#f05032' },
        { icon: 'fa-linux', color: '#f5a623' }
    ];

    function spawnIcon() {
        if (!bus || !container) return;

        // Get bus position
        const busRect = bus.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        // Calculate position relative to container
        // We want drops from the "back" (left side since it moves right)
        // Adjust these offsets based on the new bus size (280px width)
        const dropX = (busRect.left - containerRect.left) + 20;
        const dropY = (busRect.top - containerRect.top) + 60; // Just below window level

        // Only drop if bus is visible on screen (roughly)
        if (dropX < -50 || dropX > containerRect.width + 50) return;

        // Create Icon
        const tool = tools[Math.floor(Math.random() * tools.length)];
        const el = document.createElement('div');
        el.className = 'dropping-icon icon-drop-anim';
        el.style.left = `${dropX}px`;
        el.style.top = `${dropY}px`;
        el.style.color = tool.color;

        el.innerHTML = `<i class="fab ${tool.icon} ${tool.icon === 'fa-dharmachakra' ? 'fas' : ''}"></i>`;

        container.appendChild(el);

        // Cleanup after animation
        setTimeout(() => {
            el.remove();
        }, 2000); // Match CSS animation duration
    }

    // Spawn loop
    // Drop faster to make it "evident"
    setInterval(spawnIcon, 600);
});
