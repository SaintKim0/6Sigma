import React, { useEffect, useRef, useState } from 'react';
import { X, LogIn, UserPlus, FolderOpen, Folder, Save, Trash2, LogOut, User, Download, Upload } from 'lucide-react';
import { loginUser, registerUser } from '../utils/authStore';
import {
  deleteUserProject,
  downloadUserBackup,
  listProjects,
  readBackupFile,
  renameUserProject,
  restoreUserBackup,
  mergeRemoteProjects,
  setProjectFolderFileName,
  upsertImportedProject
} from '../utils/projectStore';
import { getSyncStatus, isCloudEnabled, pushProjects, pullProjects } from '../utils/syncApi';
import {
  canUseFolderPicker,
  canUseOpenPicker,
  clearStoredFolder,
  getFolderStatus,
  pickAndReadProjectFile,
  pickLocalFolder,
  readProjectTextFile,
  requestFolderPermission,
  saveProjectToFolder,
  suggestFileStem
} from '../utils/localFolderStore';


const overlay = {
  position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.45)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  zIndex: 9999, padding: '1rem'
};
const modal = {
  background: 'white', borderRadius: 16, width: '100%', maxWidth: 440,
  maxHeight: '90vh', overflow: 'auto', boxShadow: '0 20px 50px rgba(0,0,0,0.2)'
};
const header = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  padding: '1rem 1.25rem', borderBottom: '1px solid #e2e8f0'
};
const body = { padding: '1.25rem' };
const inputStyle = {
  width: '100%', padding: '0.7rem 0.85rem', borderRadius: 10,
  border: '1px solid #cbd5e1', fontFamily: 'inherit', marginBottom: '0.75rem'
};
const labelStyle = { display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#64748b', marginBottom: 4 };

export const AuthModal = ({ mode = 'login', onClose, onSuccess }) => {
  const [tab, setTab] = useState(mode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const session = tab === 'register'
        ? await registerUser({ name, email, password })
        : await loginUser({ email, password });
      onSuccess?.(session);
      onClose?.();
    } catch (err) {
      setError(err.message || '처리 중 오류가 발생했습니다.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={overlay} onClick={onClose}>
      <div style={modal} onClick={e => e.stopPropagation()}>
        <div style={header}>
          <strong style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {tab === 'login' ? <LogIn size={18} /> : <UserPlus size={18} />}
            {tab === 'login' ? '로그인' : '회원가입'}
          </strong>
          <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>
        <div style={body}>
          <div style={{ display: 'flex', gap: 8, marginBottom: '1rem' }}>
            <button type="button" className={tab === 'login' ? 'btn-primary' : 'btn-text'}
              onClick={() => { setTab('login'); setError(''); }}>로그인</button>
            <button type="button" className={tab === 'register' ? 'btn-primary' : 'btn-text'}
              onClick={() => { setTab('register'); setError(''); }}>회원가입</button>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem', lineHeight: 1.5 }}>
            계정은 이 브라우저에 저장됩니다. 로그인 후 프로젝트 이름·날짜로 저장하고, 나중에 이어서 열 수 있습니다.
          </p>
          <form onSubmit={submit}>
            {tab === 'register' && (
              <>
                <label style={labelStyle}>이름</label>
                <input style={inputStyle} value={name} onChange={e => setName(e.target.value)} placeholder="홍길동" />
              </>
            )}
            <label style={labelStyle}>이메일</label>
            <input style={inputStyle} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="username" />
            <label style={labelStyle}>비밀번호</label>
            <input style={inputStyle} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="4자 이상" autoComplete={tab === 'login' ? 'current-password' : 'new-password'} />
            {error && <div style={{ color: '#dc2626', fontSize: '0.85rem', marginBottom: '0.75rem' }}>{error}</div>}
            <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={busy}>
              {busy ? '처리 중...' : (tab === 'login' ? '로그인' : '가입하고 시작')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export const SaveDraftModal = ({ defaultTitle, onClose, onSave, isUpdate = false }) => {
  const dateLabel = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\. /g, '-').replace('.', '');
  const timeLabel = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
  const base = (defaultTitle || '').trim() || '새 프로젝트';
  const suggestions = [
    base,
    `${base} (${dateLabel})`,
    `${dateLabel} 작업분`
  ];

  const [title, setTitle] = useState(isUpdate ? base : `${base} (${dateLabel})`);
  const [busy, setBusy] = useState(false);

  return (
    <div style={overlay} onClick={onClose}>
      <div style={{ ...modal, maxWidth: 440 }} onClick={e => e.stopPropagation()}>
        <div style={header}>
          <strong style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Save size={18} /> {isUpdate ? '프로젝트 저장' : '새 이름으로 저장'}
          </strong>
          <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
        </div>
        <div style={body}>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.85rem', lineHeight: 1.5 }}>
            프로젝트 이름만 정하면 됩니다. 파일(JSON)을 다룰 필요 없이 내 계정에 저장됩니다.
          </p>
          <label style={labelStyle}>프로젝트 이름</label>
          <input
            style={inputStyle}
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="예: 사출 불량률 개선"
            autoFocus
          />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: '1rem' }}>
            {suggestions.map(s => (
              <button
                key={s}
                type="button"
                onClick={() => setTitle(s)}
                style={{
                  border: '1px solid #e2e8f0', background: '#f8fafc', borderRadius: 999,
                  padding: '0.3rem 0.7rem', fontSize: '0.75rem', cursor: 'pointer', color: '#475569'
                }}
              >
                {s}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setTitle(`${base} ${timeLabel}`)}
              style={{
                border: '1px solid #e2e8f0', background: '#f8fafc', borderRadius: 999,
                padding: '0.3rem 0.7rem', fontSize: '0.75rem', cursor: 'pointer', color: '#475569'
              }}
            >
              이름 + 시각
            </button>
          </div>
          <button
            type="button"
            className="btn-primary"
            style={{ width: '100%' }}
            disabled={busy || !title.trim()}
            onClick={async () => {
              setBusy(true);
              try {
                await onSave(title.trim());
                onClose();
              } finally {
                setBusy(false);
              }
            }}
          >
            {busy ? '저장 중...' : (isUpdate ? '저장하기' : '이 이름으로 저장')}
          </button>
        </div>
      </div>
    </div>
  );
};

export const MyProjectsModal = ({ userId, session, currentProjectId, onClose, onOpen, onDeleted }) => {
  const [projects, setProjects] = useState(() => listProjects(userId));
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [busy, setBusy] = useState(false);
  const [folderStatus, setFolderStatus] = useState(null);
  const fileRef = useRef(null);
  const sigmaFileRef = useRef(null);

  const refreshFolder = async () => {
    try {
      const status = await getFolderStatus();
      if (status.connected && !status.granted && status.handle) {
        await requestFolderPermission(status.handle);
        setFolderStatus(await getFolderStatus());
        return;
      }
      setFolderStatus(status);
    } catch {
      setFolderStatus(null);
    }
  };

  useEffect(() => {
    setProjects(listProjects(userId));
    refreshFolder();
  }, [userId]);

  const refresh = () => setProjects(listProjects(userId));

  const handleBackupAll = () => {
    try {
      downloadUserBackup(userId, session || {});
      alert('전체 백업 파일을 저장했습니다.\n다른 PC나 브라우저에서 "백업 복원"으로 가져올 수 있습니다.');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRestoreFile = async (file) => {
    if (!file) return;
    setBusy(true);
    try {
      const backup = await readBackupFile(file);
      const mode = window.confirm(
        '복원 방식 선택\n\n확인 = 기존과 합치기(merge)\n취소 = 기존 목록을 백업으로 교체(replace)'
      ) ? 'merge' : 'replace';
      if (mode === 'replace' && !window.confirm('정말 현재 프로젝트 목록을 백업 내용으로 교체할까요?')) {
        return;
      }
      const result = restoreUserBackup(userId, backup, mode);
      refresh();
      alert(
        mode === 'replace'
          ? `복원 완료: ${result.count}개 프로젝트`
          : `복원 완료: 추가 ${result.added} · 갱신 ${result.updated} · 총 ${result.count}개`
      );
    } catch (err) {
      alert(err.message || '복원 실패');
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleCloudPush = async () => {
    if (!isCloudEnabled()) {
      alert('클라우드 API가 없습니다.\n.env에 VITE_API_URL을 넣고 npm run server 를 실행하세요.');
      return;
    }
    setBusy(true);
    try {
      const result = await pushProjects(listProjects(userId), userId);
      alert(`클라우드 업로드 완료: ${result.count}개`);
    } catch (err) {
      alert(err.message || '업로드 실패');
    } finally {
      setBusy(false);
    }
  };

  const handlePickFolder = async () => {
    setBusy(true);
    try {
      const picked = await pickLocalFolder();
      await refreshFolder();
      alert(`폴더 「${picked.name}」을 지정했습니다.\n프로젝트마다 이름을 정해 .sigma 파일로 저장하세요.`);
    } catch (err) {
      if (err?.name !== 'AbortError') alert(err.message || '폴더 지정에 실패했습니다.');
    } finally {
      setBusy(false);
    }
  };

  const handleSaveProjectToFolder = async (project) => {
    if (!folderStatus?.connected) {
      alert('먼저 PC 폴더를 지정하세요.');
      return;
    }
    const suggested = suggestFileStem(project.folderFileName || project.title);
    const typed = window.prompt('이 프로젝트의 파일 이름입니다. 확장자 .sigma는 자동으로 붙습니다.', suggested);
    if (typed == null) return;
    const stem = typed.trim();
    if (!stem) {
      alert('파일 이름을 입력하세요.');
      return;
    }
    setBusy(true);
    try {
      const result = await saveProjectToFolder(project, stem);
      setProjectFolderFileName(userId, project.id, result.fileName);
      refresh();
      await refreshFolder();
      alert(`「${result.fileName}」으로 저장했습니다.\n폴더: ${result.folderName}`);
    } catch (err) {
      if (err?.name !== 'AbortError') alert(err.message || '폴더 저장에 실패했습니다.');
    } finally {
      setBusy(false);
    }
  };

  const openParsedProject = (parsed) => {
    if (parsed.type === 'many') {
      const result = restoreUserBackup(userId, parsed.backup, 'merge');
      refresh();
      alert(`여러 프로젝트를 가져왔습니다. 총 ${result.count}개입니다. 목록에서 열어 이어서 하세요.`);
      return;
    }
    const project = upsertImportedProject(userId, parsed.project, parsed.fileName?.endsWith('.sigma') ? parsed.fileName : parsed.project?.folderFileName);
    refresh();
    onOpen?.(project);
  };

  const handleOpenSigmaFile = async () => {
    setBusy(true);
    try {
      if (canUseOpenPicker()) {
        const parsed = await pickAndReadProjectFile();
        openParsedProject(parsed);
      } else {
        sigmaFileRef.current?.click();
      }
    } catch (err) {
      if (err?.message === 'FILE_INPUT') {
        sigmaFileRef.current?.click();
      } else if (err?.name !== 'AbortError') {
        alert(err.message || '파일을 열지 못했습니다.');
      }
    } finally {
      setBusy(false);
    }
  };

  const handleSigmaFileInput = async (file) => {
    if (!file) return;
    setBusy(true);
    try {
      const parsed = await readProjectTextFile(file);
      openParsedProject(parsed);
    } catch (err) {
      alert(err.message || '파일을 열지 못했습니다.');
    } finally {
      setBusy(false);
      if (sigmaFileRef.current) sigmaFileRef.current.value = '';
    }
  };

  const handleClearFolder = async () => {
    if (!window.confirm('지정 폴더만 해제합니다. PC에 저장된 파일은 지우지 않습니다.')) return;
    setBusy(true);
    try {
      await clearStoredFolder();
      await refreshFolder();
    } catch (err) {
      alert(err.message || '지정 해제에 실패했습니다.');
    } finally {
      setBusy(false);
    }
  };

  const handleCloudPull = async () => {
    if (!isCloudEnabled()) {
      alert('클라우드 API가 없습니다.\n.env에 VITE_API_URL을 넣고 npm run server 를 실행하세요.');
      return;
    }
    setBusy(true);
    try {
      const remote = await pullProjects(userId);
      const result = mergeRemoteProjects(userId, remote);
      refresh();
      alert(`클라우드 불러오기 완료: 추가 ${result.added} · 갱신 ${result.updated} · 총 ${result.count}개`);
    } catch (err) {
      alert(err.message || '불러오기 실패');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={overlay} onClick={onClose}>
      <div style={{ ...modal, maxWidth: 640 }} onClick={e => e.stopPropagation()}>
        <div style={header}>
          <strong style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FolderOpen size={18} /> 내 프로젝트
          </strong>
          <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
        </div>
        <div style={body}>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.85rem' }}>
            프로젝트마다 이름을 정해 PC에 .sigma 파일로 저장할 수 있습니다. 그 파일을 열면 이어서 진행합니다.
          </p>

          <div style={{
            marginBottom: '0.85rem', padding: '0.75rem 0.85rem', borderRadius: 10,
            background: '#f6f6f3',
            border: '1px solid #d8d8d1',
            fontSize: '0.82rem',
            color: '#1a1a17',
            lineHeight: 1.5
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, marginBottom: 6 }}>
              <Folder size={15} /> PC 폴더 저장
            </div>
            <p style={{ margin: '0 0 0.7rem', color: '#5f5f58' }}>
              {folderStatus?.message
                || (canUseFolderPicker()
                  ? '내 PC 폴더를 지정하면, 저장할 때마다 그 폴더에 파일이 남습니다. 서버로는 가지 않습니다.'
                  : '이 브라우저는 폴더 지정을 지원하지 않습니다. Safari·Firefox는 파일을 받아 두었다가 「파일 열기」로 이어서 하세요.')}
              {folderStatus?.lastSyncedAt ? ` 마지막 저장: ${new Date(folderStatus.lastSyncedAt).toLocaleString('ko-KR')}` : ''}
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button type="button" className="btn-primary" style={{ padding: '0.4rem 0.75rem' }}
                onClick={handlePickFolder} disabled={busy || !canUseFolderPicker()}>
                폴더 지정
              </button>
              <button type="button" className="btn-text" style={{ padding: '0.4rem 0.75rem', border: '1px solid #cbd5e1', borderRadius: 8 }}
                onClick={handleOpenSigmaFile} disabled={busy}>
                파일 열기
              </button>
              {folderStatus?.connected && (
                <button type="button" className="btn-text" style={{ padding: '0.4rem 0.75rem', color: '#9b2c2c' }}
                  onClick={handleClearFolder} disabled={busy}>
                  지정 해제
                </button>
              )}
              <input
                ref={sigmaFileRef}
                type="file"
                accept=".sigma,.sigma-backup,.json,application/json"
                style={{ display: 'none' }}
                onChange={(e) => handleSigmaFileInput(e.target.files?.[0])}
              />
            </div>
          </div>

          <div style={{
            marginBottom: '0.85rem', padding: '0.7rem 0.85rem', borderRadius: 10,
            background: isCloudEnabled() ? '#ecfdf5' : '#fff7ed',
            border: `1px solid ${isCloudEnabled() ? '#a7f3d0' : '#fed7aa'}`,
            fontSize: '0.8rem',
            color: isCloudEnabled() ? '#065f46' : '#9a3412',
            lineHeight: 1.45
          }}>
            {getSyncStatus().message}
          </div>

          <div style={{
            display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '1rem',
            padding: '0.75rem', background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0'
          }}>
            <button type="button" className="btn-primary" style={{ padding: '0.45rem 0.8rem' }}
              onClick={handleBackupAll} disabled={busy || projects.length === 0}>
              <Download size={14} style={{ marginRight: 4 }} /> 전체 백업
            </button>
            <button type="button" className="btn-text" style={{ padding: '0.45rem 0.8rem', border: '1px solid #cbd5e1', borderRadius: 8 }}
              onClick={() => fileRef.current?.click()} disabled={busy}>
              <Upload size={14} style={{ marginRight: 4 }} /> 백업 복원
            </button>
            <button type="button" className="btn-text" style={{ padding: '0.45rem 0.8rem', border: '1px solid #cbd5e1', borderRadius: 8 }}
              onClick={handleCloudPush} disabled={busy || projects.length === 0}>
              클라우드 업로드
            </button>
            <button type="button" className="btn-text" style={{ padding: '0.45rem 0.8rem', border: '1px solid #cbd5e1', borderRadius: 8 }}
              onClick={handleCloudPull} disabled={busy}>
              클라우드 불러오기
            </button>
            <input
              ref={fileRef}
              type="file"
              accept=".sigma-backup,.backup,application/json,.json"
              style={{ display: 'none' }}
              onChange={(e) => handleRestoreFile(e.target.files?.[0])}
            />
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', alignSelf: 'center' }}>
              파일명 예: 6시그마_백업_이름_날짜.sigma-backup
            </span>
          </div>

          {projects.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#64748b', padding: '2rem 1rem' }}>
              저장된 프로젝트가 없습니다.<br />작업 중 <b>저장</b>을 누르면 이름/날짜로 여기에 쌓입니다.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {projects.map(p => (
                <div key={p.id} style={{
                  border: p.id === currentProjectId ? '2px solid #2563eb' : '1px solid #e2e8f0',
                  borderRadius: 12, padding: '0.9rem 1rem', background: p.id === currentProjectId ? '#eff6ff' : 'white'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: 180 }}>
                      {editingId === p.id ? (
                        <input style={{ ...inputStyle, marginBottom: 4 }} value={editTitle}
                          onChange={e => setEditTitle(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') {
                              renameUserProject(userId, p.id, editTitle.trim() || p.title);
                              setEditingId(null);
                              refresh();
                            }
                          }}
                        />
                      ) : (
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{p.title}</div>
                      )}
                      <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 4 }}>
                        {(p.methodology || '-').toUpperCase()} · 단계: {p.activeStep || '-'}
                        <br />
                        저장일: {p.updatedAt ? new Date(p.updatedAt).toLocaleString('ko-KR') : '-'}
                        {p.folderFileName ? ` · 파일: ${p.folderFileName}` : ''}
                        {p.id === currentProjectId ? ' · 현재 작업 중' : ''}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                      <button type="button" className="btn-primary" style={{ padding: '0.4rem 0.75rem' }}
                        onClick={() => onOpen(p)}>열기</button>
                      <button type="button" className="btn-text" style={{ padding: '0.4rem 0.5rem' }}
                        onClick={() => handleSaveProjectToFolder(p)}
                        disabled={busy || !folderStatus?.connected}
                        title={folderStatus?.connected ? '이 프로젝트를 PC 폴더에 이름.sigma로 저장' : '먼저 폴더를 지정하세요'}
                      >PC에 저장</button>
                      <button type="button" className="btn-text" style={{ padding: '0.4rem 0.5rem' }}
                        onClick={() => {
                          setEditingId(p.id);
                          setEditTitle(p.title);
                        }}>이름변경</button>
                      <button type="button" style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.4rem' }}
                        title="삭제"
                        onClick={() => {
                          if (!window.confirm(`"${p.title}" 프로젝트를 삭제할까요?`)) return;
                          deleteUserProject(userId, p.id);
                          refresh();
                          onDeleted?.(p.id);
                        }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const UserMenuBar = ({ session, onLogin, onLogout, onMyProjects, onSaveDraft }) => {
  if (!session) {
    return (
      <button className="btn-auth" onClick={onLogin} title="로그인 후 이름으로 저장할 수 있습니다">
        <User size={16} /> 로그인
      </button>
    );
  }
  return (
    <div className="user-menu">
      <span className="user-chip" title={session.email}>
        <User size={14} /> {session.name || session.email}
      </span>
      <button className="btn-draft" onClick={onSaveDraft} title="프로젝트 이름/날짜로 저장">
        <Save size={16} /> 저장
      </button>
      <button className="btn-auth" onClick={onMyProjects} title="저장된 프로젝트 목록">
        <FolderOpen size={16} /> 내 프로젝트
      </button>
      <button className="btn-auth ghost" onClick={onLogout} title="로그아웃">
        <LogOut size={16} />
      </button>
    </div>
  );
};
