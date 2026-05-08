# utils/decorators.py
import functools
import logging
import time

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)


def log_call(func):
    """Log entry and exit of any decorated function."""
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        logging.info(f"Calling {func.__name__}")
        result = func(*args, **kwargs)
        logging.info(f"{func.__name__} completed")
        return result
    return wrapper


def retry(times=3, delay=1):
    """Retry a function up to *times* attempts, sleeping *delay* seconds between tries."""
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(1, times + 1):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    logging.warning(
                        f"{func.__name__} attempt {attempt}/{times} failed: {e}"
                    )
                    if attempt == times:
                        raise
                    time.sleep(delay)
        return wrapper
    return decorator
