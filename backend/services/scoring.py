from datetime import datetime


def calculate_confidence(reports: list) -> float:
    """0.0-1.0 score based on recency and volume of user reports."""
    if not reports:
        return 0.1

    now = datetime.utcnow()
    total_weight = 0.0

    for report in reports[:10]:
        age_hours = (now - report.created_at).total_seconds() / 3600
        # Exponential decay: half-life of 48 hours
        weight = 2 ** (-age_hours / 48)
        total_weight += weight

    # Sigmoid-like saturation: 3 fresh reports ≈ 0.75
    raw = total_weight / (total_weight + 1.0)
    return round(min(max(raw, 0.1), 1.0), 2)


def score_station(
    price: float,
    distance_km: float,
    confidence: float,
    all_prices: list[float],
    max_distance: float,
) -> float:
    """Lower score = better option."""
    min_price = min(all_prices)
    max_price = max(all_prices)
    price_range = max_price - min_price if max_price != min_price else 1.0

    price_normalized = (price - min_price) / price_range
    distance_normalized = distance_km / max_distance if max_distance > 0 else 0.0

    score = (price_normalized * 0.5) + (distance_normalized * 0.3) - (confidence * 0.2)
    return round(score, 4)


def calculate_trend(reports: list) -> str:
    """Compare avg price last 24h vs 24-72h. Returns 'up', 'down', or 'stable'."""
    if len(reports) < 2:
        return "stable"

    now = datetime.utcnow()
    recent = []
    older = []

    for r in reports:
        age_seconds = (now - r.created_at).total_seconds()
        if age_seconds < 86400:
            recent.append(r.reported_price)
        elif age_seconds < 259200:
            older.append(r.reported_price)

    if not recent or not older:
        return "stable"

    avg_recent = sum(recent) / len(recent)
    avg_older = sum(older) / len(older)
    diff_pct = (avg_recent - avg_older) / avg_older * 100

    if diff_pct > 1.5:
        return "up"
    elif diff_pct < -1.5:
        return "down"
    return "stable"


def weighted_price(reports: list) -> float | None:
    """Calculate weighted average price from recent reports using decay."""
    if not reports:
        return None

    now = datetime.utcnow()
    total_weight = 0.0
    weighted_sum = 0.0

    for report in reports[:10]:
        age_hours = (now - report.created_at).total_seconds() / 3600
        weight = 2 ** (-age_hours / 48)
        weighted_sum += report.reported_price * weight
        total_weight += weight

    if total_weight == 0:
        return None
    return round(weighted_sum / total_weight, 3)
