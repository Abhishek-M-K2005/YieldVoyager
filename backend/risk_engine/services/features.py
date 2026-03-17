import time


def compute_protocol_age_days(listed_at_timestamp):

    now = int(time.time())

    age_seconds = now - listed_at_timestamp

    return age_seconds // 86400