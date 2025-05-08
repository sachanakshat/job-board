from datetime import datetime
from typing import Dict, Any

class Job:
    def __init__(
        self,
        job_id: str,
        url: str,
        board_type: str,
        status: str = 'pending',
        created_at: datetime = None,
        updated_at: datetime = None,
        result: Dict[str, Any] = None
    ):
        self.job_id = job_id
        self.url = url
        self.board_type = board_type
        self.status = status
        self.created_at = created_at or datetime.utcnow()
        self.updated_at = updated_at or datetime.utcnow()
        self.result = result or {}

    def to_dict(self) -> Dict[str, Any]:
        return {
            'job_id': self.job_id,
            'url': self.url,
            'board_type': self.board_type,
            'status': self.status,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'result': self.result
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'Job':
        return cls(
            job_id=data['job_id'],
            url=data['url'],
            board_type=data['board_type'],
            status=data.get('status', 'pending'),
            created_at=datetime.fromisoformat(data['created_at']) if 'created_at' in data else None,
            updated_at=datetime.fromisoformat(data['updated_at']) if 'updated_at' in data else None,
            result=data.get('result', {})
        ) 