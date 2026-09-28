import React from 'react'

const DEFAULT_SHORTCUTS = [
  { id: 'gemini', title: 'Gemini', url: 'https://gemini.google.com', iconClass: 'ri-gemini-fill' },
  { id: 'claude', title: 'Claude', url: 'https://claude.ai', iconClass: 'ri-claude-fill' },
  { id: 'copilot', title: 'Copilot', url: 'https://copilot.microsoft.com', iconClass: 'ri-copilot-fill' },
  { id: 'openai', title: 'OpenAI', url: 'https://chat.openai.com', iconClass: 'ri-openai-fill' },
  { id: 'github', title: 'GitHub', url: 'https://github.com', iconClass: 'ri-github-fill' },
  { id: 'youtube', title: 'YouTube', url: 'https://youtube.com', iconClass: 'ri-youtube-fill' },
]

const Taskbar = ({ shortcuts = DEFAULT_SHORTCUTS }) => {
  return (
    <div className='taskbar-widget flex items-center justify-center gap-2.5 pointer-events-auto z-20'>
      {shortcuts
        .filter((s) => s && typeof s.url === 'string' && s.url.trim())
        .map((s) => (
          <a
            key={s.id || s.url}
            href={s.url}
            className='figma-glass-card h-[6.5vh] w-[6.5vh] min-h-[42px] min-w-[42px] rounded-full flex items-center justify-center text-white cursor-pointer transition-all'
            title={s.title || s.url}
          >
            {s.iconDataUrl || s.iconUrl || (s.iconClass && (s.iconClass.startsWith('img:') || s.iconClass.startsWith('http://') || s.iconClass.startsWith('https://') || s.iconClass.startsWith('data:'))) ? (
              <img
                src={(s.iconDataUrl || s.iconUrl || s.iconClass).replace(/^img:/, '')}
                alt={s.title || ''}
                className='h-[3.2vh] w-[3.2vh] min-h-[22px] min-w-[22px] object-contain relative z-10'
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            ) : s.iconClass ? (
              <i className={`${s.iconClass} text-[2.8vh] text-white relative z-10`}></i>
            ) : (
              <i className='ri-link text-[2.8vh] text-white relative z-10'></i>
            )}
          </a>
        ))}
    </div>
  )
}

export default Taskbar
