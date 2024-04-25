import React, { useState, useEffect } from 'react';

interface MousePosition {
    x: number;
    y: number;
}

const MouseTracker: React.FC = () => {
    const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });

    const updateMousePosition = (ev: MouseEvent) => {
        console.log({ x: ev.pageX, y: ev.pageY });
        
        setMousePosition({ x: ev.pageX, y: ev.pageY });
    };

    useEffect(() => {
        // window.addEventListener('mousemove', updateMousePosition);
        window.addEventListener('mousemove', updateMousePosition);
        return () => window.removeEventListener('mousemove', updateMousePosition);
    }, []);

    return (
        <div
            className="fixed z-[9999] pointer-events-none"
            style={{
                opacity: 1,
                backgroundColor: 'rgb(255, 255, 255)',
                border: '2px solid #4CAF50', // 更明显的边框颜色
                borderRadius: '50%', // 圆形
                width: '24px', // 大小调整为24px
                height: '24px',
                transform: `translate(${mousePosition.x - 12}px, ${mousePosition.y - 12}px)`, // 减去宽度和高度的一半，使中心点对准鼠标位置
            }}
        >
        </div>
    );
}

export default MouseTracker;