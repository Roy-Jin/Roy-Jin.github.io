const panelDrag = () => {
    const dragBar = document.querySelector('.panel-content>.drag-bar');
    let startY = 0;

    dragBar.addEventListener('mousedown', (e) => {
        startY = e.clientY;
        document.body.style.cursor = 'ns-resize';

        const handleMouseMove = (e) => {
            const deltaY = e.clientY - startY;
            // console.log(deltaY);

            if (deltaY > 100) {
                document.querySelector(".panel>.container>.p1").scrollIntoView({ behavior: 'smooth', block: 'start' });
                startY = e.clientY;
            } else if (deltaY < -100) {
                document.querySelector(".panel-content").scrollIntoView({ behavior: 'smooth', block: 'end' });
                startY = e.clientY;
            }
        }

        const handleMouseUp = () => {
            document.body.style.cursor = '';
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    });
}
panelDrag();