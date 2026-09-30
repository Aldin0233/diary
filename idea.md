Project Context Tool
현재 프로젝트 상태 및 개발 기준 문서

문서 기준일: 2026-09-30
현재 단계: MVP UI 구축 완료 → Supabase 연결 및 실제 기능 개발 준비

1. 프로젝트 정의
한 줄 정의

개발자가 이동 중 떠오른 아이디어를 빠르게 기록하고, 나중에 프로젝트의 맥락과 현재 상태를 다시 이해할 수 있도록 돕는 개인용 개발 도구.

핵심 가치

이 제품은 단순한 메모 앱이 아니다.

프로젝트의 생각을 기록하고, 나중에 그 맥락을 다시 불러오는 도구다.

제품의 모든 기능은 다음 질문을 기준으로 판단한다.

이 기능이 사용자가 프로젝트를 다시 이해하고 개발을 재개하는 데 도움이 되는가?

2. 현재 개발 상태
전체 상태

현재 프로젝트는 다음 단계까지 완료되었다.

완료

MVP 제품 구조 및 기능 명세 확정

MVP 화면 구조 확정

프로젝트 목록 화면 구현

프로젝트 상세 화면 구현

빠른 기록 UI 구현

기록 관련 UI 구현

프로젝트 맥락 UI 구현

프론트엔드 파일 구조 구성

바이트 빌드 완료

Supabase 프로젝트 구성

Supabase MVP 데이터베이스 스키마 생성

RLS 활성화

사용자별 owner-only 정책 생성

updated_at 자동 갱신 트리거 생성

주요 조회용 인덱스 생성

현재 진행 예정

Supabase 클라이언트 연결

인증 상태 연결

실제 프로젝트 CRUD 연결

실제 Thought CRUD 연결

Next Action CRUD 연결

기존 UI와 Supabase 데이터 연결

Mock 데이터 제거 또는 fallback 처리

실제 데이터 기준 통합 테스트

아직 구현하지 않음

검색

기록 유형을 활용한 필터링

Markdown

Git/GitHub 연동

IDE Extension

음성 기록

AI 기능

자동 요약

자동 프로젝트 연결

팀 협업 기능

3. 현재 프론트엔드 구조

현재 프로젝트 구조는 다음과 같다.

/
├── index.html
├── package.json
│
├── css/
│   └── style.css
│
├── js/
│   ├── app.js
│   │
│   ├── components/
│   │   ├── layout.js
│   │   ├── navigation.js
│   │   ├── ui.js
│   │   ├── capture.js
│   │   ├── timeline.js
│   │   └── context.js
│   │
│   ├── data/
│   │   └── mock.js
│   │
│   └── pages/
│       └── project.js
│
└── assets/

현재 코드 수정 원칙

Supabase 연결 작업을 시작하더라도 기존 코드를 불필요하게 재작성하지 않는다.

우선 다음 파일은 현재 구현을 유지한다.

capture.js
timeline.js
context.js
mock.js


다음 파일도 실행상 문제가 없다면 그대로 유지한다.

layout.js
navigation.js
ui.js
project.js


실제 데이터 연결에 필요한 경우에만 최소 범위로 수정한다.

4. MVP 데이터 모델

현재 Supabase에는 다음 세 개의 핵심 테이블이 생성되어 있다.

Project
 ├── Thought
 └── Next Action

Project
projects
- id
- user_id
- name
- description
- status
- current_status
- created_at
- updated_at


프로젝트의 전체적인 맥락과 현재 상태를 관리한다.

Thought
thoughts
- id
- user_id
- project_id
- content
- type
- context_snapshot
- created_at
- updated_at


프로젝트를 진행하면서 발생하는 생각, 아이디어, 문제, 결정 등을 저장한다.

context_snapshot은 기록 당시의 프로젝트 상태를 보존하기 위한 필드다.

이를 통해 이후 projects.current_status가 변경되더라도 기록 당시의 맥락을 확인할 수 있다.

Next Action
next_actions
- id
- user_id
- project_id
- title
- completed
- position
- created_at
- updated_at


프로젝트를 다시 시작했을 때 수행할 다음 행동을 저장한다.

position을 이용하여 사용자가 지정한 순서를 유지할 수 있도록 한다.

5. 데이터 관계

현재 관계는 다음과 같다.

User
 │
 ├── Projects
 │      │
 │      ├── Thoughts
 │      │
 │      └── Next Actions
 │
 └── ...


보다 구체적으로는:

auth.users
     │
     │ 1:N
     ▼
projects
     │
     ├───────────────┐
     │               │
     │ 1:N           │ 1:N
     ▼               ▼
thoughts       next_actions


각 데이터는 user_id를 통해 사용자 소유권을 명시한다.

6. Supabase 데이터베이스 상태
생성 완료 테이블
public.projects
public.thoughts
public.next_actions

FK
projects
projects.user_id
    → auth.users.id

thoughts
thoughts.user_id
    → auth.users.id

thoughts.project_id
    → projects.id

next_actions
next_actions.user_id
    → auth.users.id

next_actions.project_id
    → projects.id


프로젝트 삭제 시 해당 프로젝트의 Thought와 Next Action도 삭제된다.

Project DELETE
      │
      ├── Thoughts DELETE
      └── Next Actions DELETE


이는 ON DELETE CASCADE로 구현되어 있다.

7. 프로젝트 상태

MVP 프로젝트 상태는 세 가지로 제한한다.

진행 중
잠시 멈춤
완료


상태 관리의 목적은 복잡한 프로젝트 관리가 아니다.

프로젝트 목록에서 사용자가 프로젝트의 현재 상태를 빠르게 파악하도록 하는 것이 목적이다.

8. Thought 유형

현재 DB에서 다음 유형을 지원한다.

아이디어
문제
결정
TODO


다만 MVP 입력 과정에서는 기록 유형을 필수로 요구하지 않는다.

현재 DB 구조에서도 type은 nullable이다.

따라서 기본 기록 흐름은 계속해서 다음과 같이 유지한다.

프로젝트 선택
+
내용 입력
+
저장

9. 프로젝트 맥락 구조

프로젝트 상세 화면에서는 다음 세 가지 정보를 핵심으로 제공한다.

현재 상태

지금 프로젝트가 어디에 있는가?

DB:

projects.current_status

최근 생각

무슨 생각을 해왔는가?

DB:

thoughts


최근 생성된 Thought를 시간순으로 표시한다.

다음 할 일

그래서 무엇을 해야 하는가?

DB:

next_actions


완료되지 않은 Next Action을 중심으로 표시한다.

10. 핵심 사용자 흐름
A. 프로젝트 생성
프로젝트 목록
    ↓
프로젝트 생성
    ↓
이름
설명
현재 상태
다음 할 일
    ↓
Project 생성

B. 빠른 기록
빠른 기록
    ↓
프로젝트 선택
    ↓
내용 입력
    ↓
Thought 생성
    ↓
프로젝트 상세 또는 기존 화면으로 복귀


Thought 생성 시 가능하다면 현재 프로젝트 상태를 함께 저장한다.

projects.current_status
        ↓
thoughts.context_snapshot

C. 프로젝트 재개
프로젝트 목록
    ↓
프로젝트 선택
    ↓
프로젝트 상세
    │
    ├── 현재 상태
    │
    ├── 다음 할 일
    │
    └── 최근 생각


이 흐름이 제품의 핵심 가치다.

11. RLS 및 데이터 보안

현재 세 개의 테이블 모두 RLS가 활성화되어 있다.

projects
thoughts
next_actions


인증되지 않은 anon 사용자는 테이블 접근 권한을 갖지 않는다.

인증된 사용자는 CRUD 권한을 가지지만 RLS를 통해 자신의 데이터만 접근할 수 있다.

기본적인 정책 구조는 다음과 같다.

authenticated user
        │
        ▼
user_id = auth.uid()
        │
        ▼
본인의 데이터만 접근


Thought와 Next Action을 생성하거나 수정할 때에는 연결된 Project 역시 현재 사용자의 소유인지 확인한다.

12. updated_at 관리

세 테이블에는 updated_at 자동 갱신 트리거가 적용되어 있다.

projects
thoughts
next_actions


레코드가 수정되면:

updated_at = now()


으로 자동 변경된다.

따라서 프론트엔드에서 단순 수정 작업을 수행할 때 updated_at을 직접 관리할 필요가 없다.

13. 현재 인덱스

기본적인 사용자 및 프로젝트 조회를 위해 다음 인덱스가 생성되어 있다.

Projects
projects_user_id_idx
projects_updated_at_idx

Thoughts
thoughts_user_id_idx
thoughts_project_id_idx
thoughts_created_at_idx

Next Actions
next_actions_user_id_idx
next_actions_project_id_idx
next_actions_position_idx


현재 MVP 규모에서는 별도의 복잡한 검색 최적화를 추가하지 않는다.

14. Mock 데이터의 현재 역할

현재 프론트엔드에는 다음 Mock 데이터 구조가 존재한다.

js/data/mock.js


Supabase 연결 전까지 UI 개발 및 실행 확인을 위한 데이터로 사용한다.

실제 Supabase 연결을 시작한 이후에는 실제 데이터를 우선 사용한다.

목표 구조:

현재

UI
 ↓
mock.js


연결 이후

UI
 ↓
data/service
 ↓
Supabase


기존 컴포넌트에 Supabase 호출을 무분별하게 직접 삽입하지 않고, 가능하면 데이터 접근 계층을 분리한다.

단, 현재 프로젝트 규모에서는 과도한 아키텍처 추상화는 피한다.

15. 다음 개발 단계
Phase 1 — Supabase 연결
1. Supabase 클라이언트 구성

프론트엔드에서 Supabase 프로젝트에 연결한다.

목표:

Frontend
    ↓
Supabase Client
    ↓
Supabase

2. 인증 상태 확인

현재 로그인한 사용자의 ID를 가져올 수 있어야 한다.

auth.uid()


와 프론트엔드의 현재 사용자 정보가 일치하는지 확인한다.

3. Project CRUD

먼저 Project부터 실제 데이터 연결을 진행한다.

구현 순서:

프로젝트 조회
    ↓
프로젝트 목록 표시

프로젝트 생성
    ↓
DB INSERT

프로젝트 수정
    ↓
DB UPDATE

프로젝트 삭제
    ↓
DB DELETE


Project 연결이 정상적으로 동작한 뒤 Thought와 Next Action으로 확장한다.

16. Phase 2 — Thought 연결

구현 대상:

Thought 목록 조회
Thought 생성
Thought 수정
Thought 삭제


빠른 기록은 다음 구조로 연결한다.

Quick Capture
      ↓
project_id
content
type(optional)
context_snapshot
      ↓
Supabase thoughts

17. Phase 3 — Next Action 연결

구현 대상:

Next Action 조회
Next Action 생성
Next Action 완료 처리
Next Action 삭제


기본 동작:

□ DB abstraction 수정

↓

☑ DB abstraction 수정


완료 여부는 completed 컬럼에 저장한다.

18. Phase 4 — 프로젝트 상세 통합

프로젝트 상세 화면은 다음 세 데이터를 하나의 화면에서 조합한다.

Project
   │
   ├── current_status
   │
   ├── Thoughts
   │
   └── Next Actions


최종적으로 다음 질문에 답할 수 있어야 한다.

지금 어디까지 왔지?
→ 현재 상태

무슨 생각을 했었지?
→ 최근 생각

그래서 뭘 해야 하지?
→ 다음 할 일

19. Phase 5 — 실제 데이터 통합 테스트

다음 시나리오를 기준으로 테스트한다.

테스트 1 — 프로젝트 생성
프로젝트 생성
→ DB 저장
→ 목록에 표시
→ 상세 화면 접근

테스트 2 — Thought 생성
빠른 기록
→ 프로젝트 선택
→ 내용 입력
→ 저장
→ 프로젝트 상세의 최근 생각에 표시

테스트 3 — Next Action
TODO 추가
→ DB 저장
→ 상세 화면 표시
→ 완료 처리
→ 새로고침 후 상태 유지

테스트 4 — Project 수정
현재 상태 수정
→ DB UPDATE
→ 새로고침
→ 수정된 상태 유지

테스트 5 — 사용자 데이터 격리
User A
→ 자신의 Project만 조회

User B
→ 자신의 Project만 조회


RLS가 의도대로 동작하는지 확인한다.

20. 개발 시 지켜야 할 원칙
원칙 1 — 기존 UI를 먼저 보존한다

Supabase 연결을 위해 UI를 전면 재작성하지 않는다.

필요한 부분만 수정한다.

원칙 2 — Project를 기준으로 연결한다

모든 Thought와 Next Action은 반드시 Project에 연결된다.

project_id


없는 Thought나 Next Action을 만들지 않는다.

원칙 3 — user_id는 신뢰하지 않는다

프론트엔드에서 임의의 사용자 ID를 사용하지 않는다.

현재 인증 사용자 정보를 기준으로 처리한다.

원칙 4 — RLS를 보안의 최종 방어선으로 유지한다

프론트엔드에서 사용자 데이터를 필터링하더라도 Supabase RLS 정책을 우회하는 구조를 만들지 않는다.

원칙 5 — Mock 데이터를 실제 데이터로 교체하되 UI 구조는 유지한다

목표는 다음과 같다.

기존 UI
+
실제 Supabase 데이터


이지,

Supabase 연결
+
UI 전면 재작성


이 아니다.

21. MVP 범위
P0
Project

프로젝트 생성

프로젝트 수정

프로젝트 삭제

프로젝트 목록

프로젝트 상태

현재 상태

다음 할 일

Thought

빠른 기록

프로젝트 연결

기록 조회

기록 수정

기록 삭제

기록 시간

당시 프로젝트 상태 Snapshot

Context

현재 상태

다음 할 일

최근 생각

22. 이후 기능
P1

검색

기록 유형 활용

기록 필터

Markdown

키보드 단축키

최근 프로젝트 자동 선택

프로젝트 보관

다크 모드

P2

Git 연동

GitHub 연동

IDE Extension

음성 기록

AI 요약

AI 기반 기록 연결

프로젝트 타임라인 자동 생성

프로젝트 상태 자동 요약

23. 현재 개발 기준점

현재 프로젝트의 기준점은 다음과 같다.

[완료]

제품 기획
    ↓
MVP 화면 설계
    ↓
프론트엔드 구현
    ↓
바이트 빌드
    ↓
Supabase DB Schema
    ↓
RLS / Trigger / Index
    ↓
★ 현재 위치
    ↓
Supabase Client 연결
    ↓
인증 연결
    ↓
Project CRUD
    ↓
Thought CRUD
    ↓
Next Action CRUD
    ↓
실제 데이터 통합
    ↓
MVP 테스트

24. 다음 작업의 첫 번째 목표

다음 개발 작업에서는 기능을 한꺼번에 구현하지 않는다.

첫 번째 목표는 다음이다.

현재 UI를 유지하면서 Supabase와 안전하게 연결하고, 로그인한 사용자의 Project 데이터를 실제로 읽고 쓸 수 있게 만든다.

권장 순서는:

1. Supabase Client 연결
2. 현재 Auth User 확인
3. Project SELECT
4. Project 목록에 실제 데이터 표시
5. Project INSERT
6. Project UPDATE
7. Project DELETE
8. 정상 동작 확인
9. Thought 연결
10. Next Action 연결


Project CRUD가 안정적으로 동작한 후 다음 데이터 객체로 넘어간다.

25. MVP 최종 검증 질문

MVP 완성 여부는 기능 개수보다 다음 질문으로 판단한다.

사용자가 일주일 동안 프로젝트를 떠나 있다가 돌아왔을 때, 프로젝트 상세 화면을 보고 다시 개발을 시작할 수 있는가?

프로젝트 상세에서 다음 세 가지가 실제 데이터로 정확하게 표시되어야 한다.

현재 상태
    +
최근 생각
    +
다음 할 일


이 세 가지가 정상적으로 연결되면 Project Context Tool의 핵심 기능이 구현된 것으로 본다.