import os
import math
import numpy as np
import cv2
from PIL import Image, ImageDraw, ImageFont, ImageFilter

# -------------------------------------------------------------
# 1. 환경 및 해상도 설정 (Shorts: 1080 x 1920 세로형 9:16)
# -------------------------------------------------------------
WIDTH = 1080
HEIGHT = 1920
FPS = 30
TOTAL_DURATION = 90.0  # 1분 30초 (90초)
TOTAL_FRAMES = int(TOTAL_DURATION * FPS)

IMG_DIR = r"c:\work\mydev\ewhahome\blog\cardNews\img"
OUT_DIR = r"c:\work\mydev\ewhahome\blog\cardNews\shorts"
OUT_MP4 = os.path.join(OUT_DIR, "261004_shorts01.mp4")

# 7개 카드별 시간 배정 (초 단위, 합계 90초)
# 01_cover (12s)
# 02_card1 (13s)
# 03_card2 (13s)
# 04_card3 (13s)
# 05_card4 (13s)
# 06_card5 (13s)
# 07_end   (13s)
# 12 + 13*6 = 90초
CARD_DURATIONS = [12.0, 13.0, 13.0, 13.0, 13.0, 13.0, 13.0]

# 각 카드의 텍스트 하이라이트/포커스 영역 (카드 내 y좌표 기준)
# (y_top, y_bottom, x_center_ratio, focus_color_rgb)
FOCUS_SECTIONS = {
    0: [ # 01_cover (1080x1350)
        {"t_start": 0.10, "t_end": 0.50, "y": (160, 310), "color": (255, 215, 0), "label": "title"},      # "잘 크고 있는 우리 아이..."
        {"t_start": 0.50, "t_end": 0.90, "y": (320, 420), "color": (100, 220, 255), "label": "subtitle"}, # "집에서도 가볍게..."
    ],
    1: [ # 02_card1 (1080x1350)
        {"t_start": 0.10, "t_end": 0.45, "y": (700, 800), "color": (255, 110, 80), "label": "heading"},    # "스스로 고르는 경험"
        {"t_start": 0.45, "t_end": 0.90, "y": (900, 1070), "color": (255, 90, 90), "label": "box"},       # 이렇게 해보세요 박스
    ],
    2: [ # 03_card2
        {"t_start": 0.10, "t_end": 0.45, "y": (700, 800), "color": (245, 175, 40), "label": "heading"},    # "연습하는 즐거움"
        {"t_start": 0.45, "t_end": 0.90, "y": (900, 1070), "color": (230, 140, 20), "label": "box"},
    ],
    3: [ # 04_card3
        {"t_start": 0.10, "t_end": 0.45, "y": (700, 800), "color": (50, 150, 255), "label": "heading"},    # "스스로 해결해 보는 경험"
        {"t_start": 0.45, "t_end": 0.90, "y": (900, 1070), "color": (40, 130, 240), "label": "box"},
    ],
    4: [ # 05_card4
        {"t_start": 0.10, "t_end": 0.45, "y": (700, 800), "color": (30, 180, 130), "label": "heading"},    # "작은 실패, 다시 해보기"
        {"t_start": 0.45, "t_end": 0.90, "y": (900, 1070), "color": (20, 160, 110), "label": "box"},
    ],
    5: [ # 06_card5
        {"t_start": 0.10, "t_end": 0.45, "y": (700, 800), "color": (160, 100, 240), "label": "heading"},   # "마음을 말로 정리하기"
        {"t_start": 0.45, "t_end": 0.90, "y": (900, 1070), "color": (140, 80, 220), "label": "box"},
    ],
    6: [ # 07_end
        {"t_start": 0.10, "t_end": 0.50, "y": (300, 470), "color": (255, 200, 50), "label": "heading"},    # "지금도 충분히 잘 자라고 있어요"
        {"t_start": 0.50, "t_end": 0.90, "y": (520, 680), "color": (40, 180, 240), "label": "desc"},       # "해볼 몫을 조금만 더 남겨주세요..."
    ]
}

# -------------------------------------------------------------
# 2. 소스 이미지 로드 및 배경 블러 프리셋 생성
# -------------------------------------------------------------
image_filenames = [
    "01_cover.png",
    "02_card1.png",
    "03_card2.png",
    "04_card3.png",
    "05_card4.png",
    "06_card5.png",
    "07_end.png"
]

loaded_cards = []
for fname in image_filenames:
    p = os.path.join(IMG_DIR, fname)
    pil_im = Image.open(p).convert("RGB")
    loaded_cards.append(pil_im)

# -------------------------------------------------------------
# 3. 프레임 렌더러 함수
# -------------------------------------------------------------
def render_card_frame(card_idx, card_progress, global_progress):
    """
    card_idx: 0~6
    card_progress: 0.0 ~ 1.0 (현재 카드의 진행률)
    global_progress: 0.0 ~ 1.0 (전체 영상 90초 진행률)
    """
    card_img = loaded_cards[card_idx]
    cw, ch = card_img.size

    # A. 웅장한 배경 (카드를 1080x1920에 꽉 채우고 강한 가우시안 블러 + 어두운 딤)
    # 배경 약간 서서히 줌
    bg_zoom = 1.15 + 0.05 * math.sin(card_progress * math.pi)
    bg_w = int(WIDTH * bg_zoom)
    bg_h = int(HEIGHT * bg_zoom)
    bg_scaled = card_img.resize((bg_w, bg_h), Image.Resampling.BILINEAR)
    
    # 중앙 크롭
    left = (bg_w - WIDTH) // 2
    top = (bg_h - HEIGHT) // 2
    bg_cropped = bg_scaled.crop((left, top, left + WIDTH, top + HEIGHT))
    bg_blurred = bg_cropped.filter(ImageFilter.GaussianBlur(radius=35))
    
    # 배경 어둡게 오버레이 (0.45 딤)
    dark_overlay = Image.new("RGB", (WIDTH, HEIGHT), (12, 18, 28))
    frame_pil = Image.blend(bg_blurred, dark_overlay, 0.45)
    
    # B. 메인 카드 랜더링 (980x1225 크기로 중앙에 둥근 모서리 + 그림자)
    # 켄 번스 효과 (Ken Burns): 아주 부드러운 줌인 (1.0 -> 1.03)
    target_cw = 960
    target_ch = int(target_cw * (ch / cw)) # 960 * 1.25 = 1200
    
    scale_factor = 1.0 + 0.025 * card_progress
    cur_cw = int(target_cw * scale_factor)
    cur_ch = int(target_ch * scale_factor)
    
    card_resized = card_img.resize((cur_cw, cur_ch), Image.Resampling.LANCZOS)
    
    # 카드 둥근 모서리 마스크 (반경 32px)
    mask = Image.new("L", (cur_cw, cur_ch), 0)
    draw_mask = ImageDraw.Draw(mask)
    draw_mask.rounded_rectangle([0, 0, cur_cw, cur_ch], radius=36, fill=255)
    
    card_x = (WIDTH - cur_cw) // 2
    card_y = (HEIGHT - cur_ch) // 2 + 10  # 중앙 약간 아래
    
    # C. 그림자 레이어
    shadow_pad = 40
    shadow = Image.new("RGBA", (cur_cw + shadow_pad*2, cur_ch + shadow_pad*2), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(shadow)
    s_draw.rounded_rectangle([shadow_pad, shadow_pad + 15, shadow_pad + cur_cw, shadow_pad + cur_ch + 15], radius=36, fill=(0, 0, 0, 180))
    shadow_blurred = shadow.filter(ImageFilter.GaussianBlur(radius=25))
    
    frame_pil.paste(shadow_blurred, (card_x - shadow_pad, card_y - shadow_pad), shadow_blurred)
    frame_pil.paste(card_resized, (card_x, card_y), mask)
    
    # D. 포커스 / 하이라이트 효과 (글자 주위 인터랙티브 광선 / 점 / 스캔 라인)
    draw = ImageDraw.Draw(frame_pil, "RGBA")
    
    # 포커스 섹션 확인
    sections = FOCUS_SECTIONS.get(card_idx, [])
    for sec in sections:
        if sec["t_start"] <= card_progress <= sec["t_end"]:
            sec_p = (card_progress - sec["t_start"]) / (sec["t_end"] - sec["t_start"])
            
            # 카드 내 y 좌표를 프레임 전체 y 좌표로 매핑
            orig_y1, orig_y2 = sec["y"]
            mapped_y1 = card_y + int(orig_y1 * (cur_ch / ch))
            mapped_y2 = card_y + int(orig_y2 * (cur_ch / ch))
            
            color = sec["color"]
            r, g, b = color
            
            # 1) 텍스트 아래 부드러운 하이라이트 바 (형광펜 효과가 좌->우로 슥 칠해짐)
            hl_x_start = card_x + 50
            hl_x_max = card_x + cur_cw - 50
            current_x = hl_x_start + int((hl_x_max - hl_x_start) * min(1.0, sec_p * 1.5))
            
            # 하단에 네온 밑줄 바
            underline_y = mapped_y2 + 4
            draw.line([(hl_x_start, underline_y), (current_x, underline_y)], fill=(r, g, b, 230), width=6)
            
            # 2) 진행 중인 위치에 빛나는 점(Glowing Orb/Sparkle)
            if sec_p < 1.0:
                orb_x = current_x
                orb_y = underline_y
                # 반투명 글로우 원
                glow_r = 14 + int(4 * math.sin(card_progress * 25))
                draw.ellipse([orb_x - glow_r, orb_y - glow_r, orb_x + glow_r, orb_y + glow_r], fill=(r, g, b, 90))
                draw.ellipse([orb_x - 6, orb_y - 6, orb_x + 6, orb_y + 6], fill=(255, 255, 255, 255))
            
            # 3) 영역 전체에 고급스러운 부드러운 브리딩 박스 글로우
            box_alpha = int(45 * math.sin(sec_p * math.pi))
            draw.rounded_rectangle([card_x + 35, mapped_y1 - 6, card_x + cur_cw - 35, mapped_y2 + 10], radius=16, outline=(r, g, b, int(box_alpha * 2.5)), width=2)
            break

    # E. 상단 브랜드 헤더 (이화아트스쿨 배지)
    badge_w = 360
    badge_h = 60
    badge_x = (WIDTH - badge_w) // 2
    badge_y = 60
    
    # 캡슐 배지 배경
    draw.rounded_rectangle([badge_x, badge_y, badge_x + badge_w, badge_y + badge_h], radius=30, fill=(255, 255, 255, 240), outline=(45, 212, 191, 255), width=2)
    
    # 왕관 이모지 및 텍스트
    # 폰트 로드 (윈도우 기본 맑은 고딕 / Pretendard)
    try:
        font_logo = ImageFont.truetype("malgunbd.ttf", 22)
        font_sub = ImageFont.truetype("malgun.ttf", 15)
    except:
        font_logo = ImageFont.load_default()
        font_sub = ImageFont.load_default()
        
    draw.text((badge_x + 32, badge_y + 16), "👑  EWHA ART", fill=(13, 148, 136), font=font_logo)
    
    # 우측 페이지 인디케이터 (1/7 ~ 7/7)
    draw.text((badge_x + badge_w - 75, badge_y + 19), f"{card_idx + 1} / 7", fill=(100, 116, 139), font=font_sub)

    # F. 하단 전체 재생 프로그레스 바 (90초)
    prog_y = HEIGHT - 45
    prog_pad = 60
    draw.line([(prog_pad, prog_y), (WIDTH - prog_pad, prog_y)], fill=(255, 255, 255, 60), width=6)
    
    cur_prog_w = int((WIDTH - prog_pad * 2) * global_progress)
    if cur_prog_w > 0:
        # 그라데이션 대신 선명한 민트/골드 프로그레스 라인
        draw.line([(prog_pad, prog_y), (prog_pad + cur_prog_w, prog_y)], fill=(56, 189, 248, 255), width=6)
        # 끝점에 빛나는 원
        draw.ellipse([prog_pad + cur_prog_w - 6, prog_y - 6, prog_pad + cur_prog_w + 6, prog_y + 6], fill=(255, 255, 255, 255))
        
    # 하단 시간 표시 (00:00 / 01:30)
    cur_sec = int(global_progress * TOTAL_DURATION)
    time_str = f"{cur_sec//60:02d}:{cur_sec%60:02d} / 01:30"
    try:
        font_time = ImageFont.truetype("malgun.ttf", 18)
    except:
        font_time = ImageFont.load_default()
    draw.text((WIDTH // 2 - 50, HEIGHT - 85), time_str, fill=(203, 213, 225, 220), font=font_time)

    # PIL -> OpenCV BGR 변환
    frame_np = np.array(frame_pil)
    frame_bgr = cv2.cvtColor(frame_np, cv2.COLOR_RGB2BGR)
    return frame_bgr


# -------------------------------------------------------------
# 4. 전체 동영상 프레임 생성 및 인코딩
# -------------------------------------------------------------
def make_shorts():
    print(f"Shorts Rendering Start: {OUT_MP4}")
    print(f"Total Duration: {TOTAL_DURATION}s ({TOTAL_FRAMES} frames, FPS: {FPS})")
    
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out_writer = cv2.VideoWriter(OUT_MP4, fourcc, FPS, (WIDTH, HEIGHT))
    
    # 전환 효과 길이 (초) - 디졸브 / 페이드 트랜지션
    TRANSITION_DUR = 0.8
    TRANSITION_FRAMES = int(TRANSITION_DUR * FPS)
    
    # 누적 시작 프레임 계산
    card_start_frames = []
    accum = 0
    for dur in CARD_DURATIONS:
        card_start_frames.append(accum)
        accum += int(dur * FPS)
        
    for frame_i in range(TOTAL_FRAMES):
        global_progress = frame_i / TOTAL_FRAMES
        global_time = frame_i / FPS
        
        # 현재 어느 카드인지 찾기
        curr_card_idx = 0
        for idx, s_frame in enumerate(card_start_frames):
            if frame_i >= s_frame:
                curr_card_idx = idx
            else:
                break
                
        card_start_f = card_start_frames[curr_card_idx]
        card_total_f = int(CARD_DURATIONS[curr_card_idx] * FPS)
        card_progress = min(1.0, (frame_i - card_start_f) / card_total_f)
        
        # 기본 현재 프레임 렌더
        frame = render_card_frame(curr_card_idx, card_progress, global_progress)
        
        # 다음 카드로의 디졸브(크로스 페이드) 트랜지션 처리
        frames_left_in_card = (card_start_f + card_total_f) - frame_i
        if frames_left_in_card < TRANSITION_FRAMES and curr_card_idx < len(loaded_cards) - 1:
            next_idx = curr_card_idx + 1
            trans_p = 1.0 - (frames_left_in_card / TRANSITION_FRAMES) # 0.0 -> 1.0
            next_frame = render_card_frame(next_idx, 0.0, global_progress)
            
            # 부드러운 코사인 블렌딩
            alpha = 0.5 * (1.0 - math.cos(trans_p * math.pi))
            frame = cv2.addWeighted(frame, 1.0 - alpha, next_frame, alpha, 0)
            
        out_writer.write(frame)
        
        if frame_i % 150 == 0 or frame_i == TOTAL_FRAMES - 1:
            pct = (frame_i + 1) / TOTAL_FRAMES * 100
            print(f"[{pct:.1f}%] {frame_i+1}/{TOTAL_FRAMES} frames done ({global_time:.1f}s)")
            
    out_writer.release()
    print("Shorts Video Completed successfully!")

if __name__ == "__main__":
    make_shorts()
